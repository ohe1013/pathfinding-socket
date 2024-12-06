import Pathfinding from "pathfinding";
import { map } from "../../data/item";
import { Coordinate } from "../types";
import { Room } from "../models/Room";

export class PathfindingService {
  grid: Pathfinding.Grid;
  finder: Pathfinding.AStarFinder;
  constructor() {
    this.grid = new Pathfinding.Grid(
      map.size[0] * map.gridDivision,
      map.size[1] * map.gridDivision
    );
    this.finder = new Pathfinding.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true,
    } as any);
  }
  updateGrid(room: Room) {
    // Reset grid
    for (let x = 0; x < room.size[0] * room.gridDivision; x++) {
      for (let y = 0; y < room.size[1] * room.gridDivision; y++) {
        room.grid.setWalkableAt(x, y, true);
      }
    }

    // Update with items
    room.items.forEach((item) => {
      if (item.walkable || item.wall) return;
      const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
      const height = item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          room.grid.setWalkableAt(item.gridPosition[0] + x, item.gridPosition[1] + y, false);
        }
      }
    });
  }

  findPath(start: Coordinate, end: Coordinate) {
    const gridClone = this.grid.clone();
    return this.finder.findPath(start[0], start[1], end[0], end[1], gridClone) as Coordinate[];
  }
}
