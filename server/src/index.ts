import { Server } from "socket.io";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./socket/handlers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({
  path: path.join(
    __dirname,
    `./.env${process.env.NODE_ENV === "production" ? "" : ".development"}`
  ),
});
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
    origin: "*",
  },
});
io.listen(Number(serverConfig.port));

console.log(`Server is running ${serverConfig.clientUrl}`);

io.on("connection", (socket) => {
  setupSocketHandlers(io, socket);
});
