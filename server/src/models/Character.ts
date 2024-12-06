import { Coordinate } from "../types";

type CharacterProps = {
  id: string;
  session: number;
  position: Coordinate;
};

class Character {
  id: string;
  session: number;
  position: Coordinate;
  path?: Coordinate[];

  constructor(props: CharacterProps) {
    this.id = props.id;
    this.session = props.session;
    this.position = props.position;
  }

  setPosition(newPosition: Coordinate) {
    this.position = newPosition;
  }
  getPosition() {
    return this.position;
  }
}
export default Character;
