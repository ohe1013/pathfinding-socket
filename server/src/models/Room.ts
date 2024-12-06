import Pathfinding from "pathfinding";
import { RoomData } from "../services/RoomService";
import Character from "./Character";
import { Size } from "../types";

export class Room {
  id: RoomData["id"];
  name: RoomData["name"];
  size: Size;
  gridDivision: number;
  items: RoomData["items"];
  characters: Character[];
  grid: Pathfinding.Grid;
  constructor({
    id,
    name,
    size = [7, 7],
    gridDivision = 2,
    items = [],
  }: RoomData & { size: [number, number]; gridDivision: number }) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.gridDivision = gridDivision;
    this.items = items;
    this.characters = [];
    this.grid = new Pathfinding.Grid(
      this.size[0] * this.gridDivision,
      this.size[1] * this.gridDivision
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nbCharacters: this.characters.length,
    };
  }
}
