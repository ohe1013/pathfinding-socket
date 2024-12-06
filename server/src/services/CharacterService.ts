import Pathfinding from "pathfinding";
import { map } from "../../data/item";
import Character from "../models/Character";
import { generateRandomPosition } from "../util";
import { Coordinate } from "../types";

export class CharacterService {
  characters: Character[];
  grid: Pathfinding.Grid;

  constructor(grid: Pathfinding.Grid) {
    this.characters = [];
    this.grid = grid;
  }

  addCharacter(socketId: string) {
    const newCharacter = new Character({
      id: socketId,
      position: generateRandomPosition([map.size[0], map.size[1]], map.gridDivision, this.grid),
      session: Math.round(Math.random() * 1000),
    });
    if (this.characters.filter((character) => character.id === socketId).length > 0) {
      return console.error("이미 있는 character 입니다.");
    } else {
      this.characters = [...this.characters, newCharacter];
    }
    return newCharacter;
  }

  removeCharacter(socketId: string) {
    this.characters = this.characters.filter((char) => char.id !== socketId);
  }

  updateCharacterPosition(socketId: string, from: Coordinate, path: Coordinate[]) {
    const character = this.characters.find((char) => char.id === socketId);
    if (character) {
      character.position = from;
      character.path = path;
      return character;
    }
  }
}
