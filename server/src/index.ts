import { items, map } from "../data/item";
import Pathfinding from "pathfinding";
import { Server } from "socket.io";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Character from "./models/Character";
import { Coordinate } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, `../env/.env.${process.env.NODE_ENV || "development"}`) });
const serverConfig = {
  clientUrl: process.env.CLIENT_URL,
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
};
const io = new Server({
  cors: {
    origin: serverConfig.clientUrl,
  },
});
console.log(serverConfig.port);
io.listen(Number(serverConfig.port));

console.log(`Server is running ${serverConfig.clientUrl}`);

const characters: Character[] = [];
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

const findPath = (start: Coordinate, end: Coordinate) => {
  const gridClone = grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path as Coordinate[];
};

io.on("connection", (socket) => {
  console.log("user Connected");
  const char = new Character({
    id: socket.id,
    position: generateRandomPosition() as Coordinate,
    session: Math.round(Math.random() * 1000),
  });
  characters.push(char);

  socket.emit("conn", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);

  socket.on("move", (from, to) => {
    const character = characters.find((char) => char.id === socket.id);
    const path = findPath(from, to);
    if (!path || !character) {
      return;
    }

    character.position = from;
    character.path = path;
    io.emit("playerMove", character);
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
