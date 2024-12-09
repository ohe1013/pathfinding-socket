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
  const defaultRoomId = "lobby";
  const rooms = roomService.getAllRooms();
  let room = rooms.find((room) => room.id === defaultRoomId);
  if (!room) {
    return;
  }
  const newCharcter = characterService.createCharacter(socket.id, room);
  characterService.addCharacter(newCharcter);
  roomService.addCharacterToRoom(defaultRoomId, newCharcter);
  socket.join(room.id);
  socket.emit("conn", {
    map: {
      gridDivision: room.gridDivision,
      size: room.size,
      items: room.items,
    },
    characters: room.characters,
    id: socket.id,
  });
  const switchRoom = (newRoomId: string, opts: { position: Coordinate }) => {
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
    const newCharcter = characterService.createCharacter(
      socket.id,
      newRoom,
      opts.position || [0, 0]
    );
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
    // room = rooms.find((room) => room.id === roomId);
    // if (!room) {
    //   return;
    // }
    // socket.join(room.id);

    // const newCharcter = characterService.createCharacter(socket.id, room);
    // characterService.addCharacter(newCharcter);
    // roomService.addCharacterToRoom(roomId, newCharcter);

    // socket.emit("roomJoined", {
    //   map: {
    //     gridDivision: room.gridDivision,
    //     size: room.size,
    //     items: room.items,
    //   },
    //   characters: room.characters,
    //   id: socket.id,
    // });
    switchRoom(roomId, opts);
  });
  // socket.on("leaveRoom", () => {
  //   if (!room) {
  //     return;
  //   }
  //   socket.leave(room.id);
  //   roomService.removeCharacterFromRoom(room.id, socket.id);
  //   const newCharcter = characterService.createCharacter(socket.id, room);
  //   roomService.addCharacterToRoom(defaultRoomId, newCharcter);
  //   onRoomUpdate(room);
  // });

  io.emit("characters", characterService.getAllChacters());

  socket.on("move", (from, to) => {
    const character = characterService.getAllChacters().find((char) => char.id === socket.id);
    const path = pathfindingService.findPath(room!, from, to);
    if (!path || !character) {
      return;
    }
    console.log(room!.id, character);

    character.position = from;
    character.path = path;
    io.to(room!.id).emit("playerMove", character);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (!room) return;
    roomService.removeCharacterFromRoom(room.id, socket.id);
    // const newCharcter = characterService.createCharacter(socket.id, room);

    // roomService.addCharacterToRoom(defaultRoomId, newCharcter);
    onRoomUpdate(room!);
  });
}
