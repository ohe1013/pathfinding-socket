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
const pathfinding = new Pathfinding.Grid(map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision);

io.on("connection", (socket) => {
  console.log("user Connected");

  socket.on("conn", console.log);
});
