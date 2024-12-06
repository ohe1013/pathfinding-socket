import Pathfinding from "pathfinding";
import { Coordinate } from "../types";

function generateRandomPosition(
  size: Coordinate,
  gridDivision: number,
  grid: Pathfinding.Grid
): Coordinate {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * size[0] * gridDivision);
    const y = Math.floor(Math.random() * size[1] * gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
  return [0, 0];
}

export { generateRandomPosition };
