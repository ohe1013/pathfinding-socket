import fs from "fs/promises";
import { Room } from "../models/Room.js";
import { PathfindingService } from "./PathfindingService.js";
import { Coordinate } from "../types/index.js";
import { generateRandomPosition } from "../util/index.js";

export interface RoomData {
  id: "lobby" | "cosyroom" | "partyroom" | "bathroom" | "weddingroom";
  name: string;
  password: string;
  items: Item[];
}

interface Item {
  name: string;
  size: Coordinate;
  rotation: number;
  gridPosition: Coordinate;
  wall?: boolean;
  walkable?: boolean;
}

export class RoomService {
  rooms: Map<RoomData["id"], Room>;
  pathfinding: PathfindingService;
  constructor() {
    this.rooms = new Map();
    this.pathfinding = new PathfindingService();
  }

  async loadRooms() {
    try {
      const data = await fs.readFile("data/rooms.json", "utf8");
      const roomsData = JSON.parse(data);

      roomsData.forEach((roomData: RoomData) => {
        const room = new Room({ size: [7, 7], ...roomData, gridDivision: 2 });
        this.pathfinding.updateGrid(room);
        this.rooms.set(room.id, room);
      });
    } catch (error) {
      console.error("Failed to load rooms:", error);
      throw error;
    }
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getRoom(roomId: Room["id"]) {
    return this.rooms.get(roomId);
  }

  addCharacterToRoom(
    roomId: Room["id"],
    character: Room["characters"][number]
  ) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    room.addCharacter(character);
    return room;
  }

  removeCharacterFromRoom(
    roomId: Room["id"],
    characterId: Room["characters"][number]["id"]
  ) {
    const room = this.getRoom(roomId);
    if (!room) return;

    const index = room.characters.findIndex((c) => c.id === characterId);
    console.log(index);
    if (index !== -1) {
      room.characters.splice(index, 1);
    }
  }
}
