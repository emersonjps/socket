import { io } from "socket.io-client";

const socket = io('http://localhost:3000', {
  withCredentials: false,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

document.getElementById('joinRoomButton')?.addEventListener('click', joinRoom);
document.getElementById('sendMessageButton')?.addEventListener('click', sendMessage);

function joinRoom() {
    const roomName = document.getElementById('roomName').value;

    if (roomName) {
      alert(`Você entrou na sala: ${roomName}`);
      document.getElementById('roomName').value = '';
    } else {
      alert('Por favor, insira o nome da sala.');
    }
}

socket.on('chat message', (msg) => {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.innerText = msg;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
  const chatBox = document.getElementById('chatBox');
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  if (message) {
    socket.emit('chat message', message);

    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    messageInput.value = '';
  } else {
    alert('Por favor, digite uma mensagem.');
  }
}
