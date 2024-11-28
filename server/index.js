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

const generateRandomPosition = () => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision);
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision);
    if (grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

io.on("connection", (socket) => {
  console.log("user Connected");

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
  });

  socket.emit("conn", {
    map,
    characters,
    id: socket.id,
    items,
  });
  io.emit("characters", characters);
});
