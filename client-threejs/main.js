import * as THREE from "three";
import socket, {
  changeAllCubesPosition,
  changeCubePosition,
} from "./socket/socket";
import { v4 as uuidv4 } from "uuid";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const players = [];

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.user_id = uuidv4();
scene.add(cube);

camera.position.z = 5;

socket.on("connect", (players) => {
  console.log("connected");
  socket.emit("init-players", {
    user_id: cube.user_id,
    position: cube.position,
  });
});

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  socket.emit("getAllChangePosition", null);

  renderer.render(scene, camera);
}

document.addEventListener("keydown", (event) => {
  const keyName = event.key;

  switch (keyName) {
    case "ArrowUp":
      cube.position.y += 0.1;
      changeCubePosition({ user_id: cube.user_id, position: cube.position });
      break;
    case "ArrowDown":
      cube.position.y -= 0.1;
      changeCubePosition({ user_id: cube.user_id, position: cube.position });
      break;
    case "ArrowLeft":
      cube.position.x -= 0.1;
      changeCubePosition({ user_id: cube.user_id, position: cube.position });
      break;
    case "ArrowRight":
      cube.position.x += 0.1;
      changeCubePosition({ user_id: cube.user_id, position: cube.position });
      break;
  }
});

window.addEventListener("beforeunload", () => {
  socket.emit("disconnect", { user_id: cube.user_id });
});

socket.on("changeAllPosition", (players) => {
  players.forEach((player) => {
    const cube = scene.getObjectByProperty("user_id", player.user_id);

    console.log(cube);

    if (cube) {
      cube.position.x = player.position.x;
      cube.position.y = player.position.y;
    } else {
      const newCube = new THREE.Mesh(geometry, material);
      newCube.position.x = player.position.x;
      newCube.position.y = player.position.y;
      newCube.user_id = player.user_id;
      scene.add(newCube);
    }
  });
});
