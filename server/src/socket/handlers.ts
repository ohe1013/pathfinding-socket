import { Server, Socket } from "socket.io";
import { PathfindingService } from "../services/PathfindingService";
import { CharacterService } from "../services/CharacterService";
import { RoomService } from "../services/RoomService";
import { Room } from "../models/Room";
import { Coordinate } from "../types";

const roomService = new RoomService();
roomService.loadRooms();
const pathfindingService = new PathfindingService();
const characterService = new CharacterService();
export async function setupSocketHandlers(io: Server, socket: Socket) {
  console.log("user Connected");
  const defaultRoomId = "weddingroom";
  const rooms = roomService.getAllRooms();
  let room = rooms.find((room) => room.id === defaultRoomId);
  if (!room) {
    return;
  }
  const newCharcter = characterService.createCharacter(socket.id, room, { position: [0, 20] });
  roomService.addCharacterToRoom(defaultRoomId, newCharcter);
  socket.join(room.id);
  socket.emit("conn", {
    map: {
      gridDivision: room.gridDivision,
      size: room.size,
      items: room.items,
      roomId: room.id,
    },
    characters: room.characters,
    id: socket.id,
  });
  const switchRoom = (newRoomId: string, opts: { position: Coordinate; avatarUrl?: string }) => {
    const newRoom = rooms.find((room) => room.id === newRoomId);
    if (!newRoom || room?.id === newRoomId) {
      return;
    }

    // Leave current room
    if (room) {
      socket.leave(room.id);
      roomService.removeCharacterFromRoom(room.id, socket.id);
      onRoomUpdate(room);
    }

    // Join new room
    socket.join(newRoom.id);
    const newCharcter = characterService.createCharacter(socket.id, newRoom, {
      position: opts.position || [0, 0],
      avatarUrl: opts.avatarUrl,
    });
    roomService.addCharacterToRoom(newRoom.id, newCharcter);
    room = newRoom;

    socket.emit("roomJoined", {
      map: {
        gridDivision: newRoom.gridDivision,
        size: newRoom.size,
        items: newRoom.items,
        roomId: newRoom.id,
      },
      characters: newRoom.characters,
      id: socket.id,
    });

    onRoomUpdate(newRoom);
  };
  const onRoomUpdate = (room: Room) => {
    console.log(
      room.id,
      room.characters.map((char) => char.id)
    );
    io.to(room.id).emit("characters", room.characters);
  };
  socket.on("joinRoom", (roomId, opts) => {
    switchRoom(roomId, opts);
  });

  io.emit("characters", room.characters);

  socket.on("move", (from, to) => {
    const character = room?.characters.find((char) => char.id === socket.id);
    const path = pathfindingService.findPath(room!, from, to);
    if (!path || !character) {
      return;
    }

    character.position = from;
    character.path = path;
    io.to(room!.id).emit("playerMove", character);
  });
  socket.on("avatar", (url) => {
    const character = room?.characters.find((char) => char.id === socket.id);
    character?.setProperty("avatarUrl", url);
    if (!character || !room) return;
    io.to(room.id).emit("characters", room.characters);
  });
  socket.on("rank", (score) => {
    const character = room?.characters.find((char) => char.id === socket.id);
    if (!character) return;
    io.to(room!.id).emit("playerRank", {
      name: character.name,
      score,
    });
  });

  socket.on("name", (name) => {
    const character = room?.characters.find((char) => char.id === socket.id);
    character?.setProperty("name", name);
  });
  socket.on("chatMessage", (message) => {
    const character = room?.characters.find((char) => char.id === socket.id);
    if (!character) return;
    io.to(room!.id).emit("playerChatMessage", {
      id: socket.id,
      name: character.name,
      message,
    });
  });

  socket.on("animation", (animationName) => {
    io.to(room!.id).emit("playerAnimation", {
      id: socket.id,
      animationName,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (!room) return;
    roomService.removeCharacterFromRoom(room.id, socket.id);
    onRoomUpdate(room!);
  });
}
