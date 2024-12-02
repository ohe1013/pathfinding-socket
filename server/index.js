import { items, map } from "./item.js";
import Pathfinding from "pathfinding";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3010",
  },
});

io.listen(3009);

console.log("Server is running on port 3010");

const characters = [];
const grid = new Pathfinding.Grid(map.size[0] * map.gridDivision, map.size[1] * map.gridDivision);

const finder = new Pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});
const updateGrid = () => {
  map.items.forEach((item) => {
    if (item.walkable || item.wall) {
      return;
    }
    const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height = item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid.setWalkableAt(item.gridPosition[0] + x, item.gridPosition[1] + y, false);
      }
    }
  });
};

updateGrid();
const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

const findPath = (start, end) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

io.on("connection", (socket) => {
  console.log("user Connected");

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
  });

  io.emit("characters", characters);

  socket.emit("conn", {
    map,
    characters,
    id: socket.id,
    items,
  });

  socket.on("move", (from, to) => {
    const character = characters.find((char) => char.id === socket.id);
    const path = findPath(from, to);
    if (!path) {
      return;
    }

    character.position = from;
    character.path = path;
    io.emit("playMove", character);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});
