import Character from "../models/Character";
import { generateRandomPosition } from "../util/index";
import { Coordinate } from "../types";
import { Room } from "../models/Room";

export class CharacterService {
  characters: Character[];

  constructor() {
    this.characters = [];
  }

  getAllChacters() {
    return this.characters;
  }

  createCharacter(socketId: string, room: Room, position?: Coordinate) {
    const newCharacter = new Character({
      id: socketId,
      position: position || generateRandomPosition(room.size, room.gridDivision, room.grid),
      session: Math.round(Math.random() * 1000),
    });
    return newCharacter;
  }

  addCharacter(newCharacter: Character) {
    if (this.characters.filter((character) => character.id === newCharacter.id).length > 0) {
      return console.error("이미 있는 character 입니다.");
    } else {
      this.characters = [...this.characters, newCharacter];
    }
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
