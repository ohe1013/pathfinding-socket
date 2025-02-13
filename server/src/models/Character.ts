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
  name?: string;
  avatarUrl?: string;

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

  setProperty<K extends keyof Character>(key: K, value: Character[K]) {
    (this as Character)[key] = value;
  }
}
export default Character;
