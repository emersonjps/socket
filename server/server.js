import express from "express";
import { join, dirname } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import e from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "http://localhost:5173"],
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const players = [];

io.on("connection", (socket) => {
  socket.on("chat message", (msg, room) => {
    if (room) {
      socket.broadcast.to(room).emit("chat message", msg);
    } else {
      socket.broadcast.emit("chat message", msg);
    }
  });

  socket.on("join room", (room) => {
    socket.join(room);
  });

  socket.on("teste", (callback) => {
    console.log("user disconnected");
    console.log(typeof callback);
    if (callback) {
      callback("msg do server");
    }
  });

  // Game
  socket.on("init-players", (player) => {
    if (!players.find((p) => p.user_id === player.user_id)) {
      players.push(player);
    }
    socket.emit("init-players", players);
  });

  socket.on("changePosition", (data) => {
    const player = players.find((player) => player.user_id === data.user_id);
    if (player) {
      player.position = data.position;
      socket.emit("changeAllPosition", players);
    } else {
      players.push(data);
      socket.emit("changeAllPosition", players);
    }
  });

  socket.on("getAllChangePosition", () => {
    socket.emit("changeAllPosition", players);
  });

  socket.on("disconnect", (dataPlayer) => {
    const index = players.findIndex(
      (player) => player.user_id === dataPlayer.user_id
    );
    if (index !== -1) {
      players.splice(index, 1);
    }
    socket.emit("changeAllPosition", players);
  });
});

httpServer.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
