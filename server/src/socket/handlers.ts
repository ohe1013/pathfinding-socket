import { Server, Socket } from "socket.io";
import { map, items } from "../../data/item";
import { PathfindingService } from "../services/PathfindingService";
import { CharacterService } from "../services/CharacterService";
import Character from "../models/Character";
import { RoomService } from "../services/RoomService";
import { generateRandomPosition } from "../util";

export async function setupSocketHandlers(io: Server, socket: Socket) {
  console.log("user Connected");
  const pathfindingService = new PathfindingService();
  const characterService = new CharacterService(pathfindingService.grid);
  const roomService = new RoomService();
  characterService.addCharacter(socket.id);
  await roomService.loadRooms();
  const characters = characterService.characters;
  const rooms = roomService.getAllRooms();

  socket.emit("conn", {
    rooms: rooms.map((room) => room.toJSON),
    map,
    characters,
    id: socket.id,
    items,
  });
  socket.on("joinRoom", (roomId, opts) => {
    const room = rooms.find((room) => room.id === roomId);
    if (!room) {
      return;
    }
    socket.join(room.id);
    const character = new Character({
      id: socket.id,
      session: Math.round(Math.random() * 1000),
      position: generateRandomPosition(room.size, room.gridDivision, room.grid),
    });
    room.characters.push(character);

    socket.emit("roomJoined", {
      map: {
        gridDivision: room.gridDivision,
        size: room.size,
        items: room.items,
      },
      characters: room.characters,
      id: socket.id,
    });
    const onRoomUpdate = () => {
      io.to(room.id).emit("characters", room.characters);
      io.emit(
        "rooms",
        rooms.map((room) => room.toJSON())
      );
    };
    onRoomUpdate();
  });

  io.emit("characters", characters);

  socket.on("move", (from, to) => {
    const character = characters.find((char) => char.id === socket.id);
    const path = pathfindingService.findPath(from, to);
    if (!path || !character) {
      return;
    }

    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
}
