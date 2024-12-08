import { Server, Socket } from "socket.io";
import { map, items } from "../../data/item";
import { PathfindingService } from "../services/PathfindingService";
import { CharacterService } from "../services/CharacterService";
import { RoomService } from "../services/RoomService";
import { Room } from "../models/Room";

export async function setupSocketHandlers(io: Server, socket: Socket) {
  console.log("user Connected");
  const defaultRoomId = "lobby";
  const pathfindingService = new PathfindingService();
  const characterService = new CharacterService();
  const roomService = new RoomService();
  await roomService.loadRooms();
  const rooms = roomService.getAllRooms();
  let room = rooms.find((room) => room.id === defaultRoomId);

  if (!room) {
    return;
  }
  const newCharcter = characterService.createCharacter(socket.id, room);
  characterService.addCharacter(newCharcter);
  roomService.addCharacterToRoom(defaultRoomId, newCharcter);
  socket.emit("conn", {
    map: {
      gridDivision: room.gridDivision,
      size: room.size,
      items: room.items,
    },
    characters: room.characters,
    id: socket.id,
  });
  const onRoomUpdate = (room: Room) => {
    io.to(room.id).emit("characters", room.characters);
  };
  socket.on("joinRoom", (roomId, opts) => {
    room = rooms.find((room) => room.id === roomId);
    if (!room) {
      return;
    }
    socket.join(room.id);

    const newCharcter = characterService.createCharacter(socket.id, room);
    characterService.addCharacter(newCharcter);
    roomService.addCharacterToRoom(roomId, newCharcter);

    socket.emit("roomJoined", {
      map: {
        gridDivision: room.gridDivision,
        size: room.size,
        items: room.items,
      },
      characters: room.characters,
      id: socket.id,
    });

    onRoomUpdate(room);
  });
  socket.on("leaveRoom", () => {
    if (!room) {
      return;
    }
    socket.leave(room.id);
    roomService.removeCharacterFromRoom(room.id, socket.id);
    const newCharcter = characterService.createCharacter(socket.id, room);
    roomService.addCharacterToRoom(defaultRoomId, newCharcter);
    onRoomUpdate(room);
  });

  io.emit("characters", characterService.getAllChacters());

  socket.on("move", (from, to) => {
    const character = characterService
      .getAllChacters()
      .find((char) => char.id === socket.id);
    const path = pathfindingService.findPath(room!, from, to);
    if (!path || !character) {
      return;
    }

    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    roomService.removeCharacterFromRoom(room!.id, socket.id);
    const newCharcter = characterService.createCharacter(socket.id, room);

    roomService.addCharacterToRoom(defaultRoomId, newCharcter);
    onRoomUpdate(room!);
  });
}
