import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: false,
  extraHeaders: {
    "my-custom-header": "game-client-threejs",
  },
});

export default socket;

export function changeCubePosition(player) {
  socket.emit("changePosition", player);
}

export function changeAllCubesPosition() {
  console.log("changeAllCubesPosition");
}

socket.on("changeAllPosition", (players) => {
  console.log(players);
  changeAllCubesPosition();
});
