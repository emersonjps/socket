import express from 'express';
import { join, dirname } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import e from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080"
      }
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {

    
    socket.on('chat message', (msg, room) => {
        if (room) {
            socket.broadcast.to(room).emit('chat message', msg);
        } else {
            socket.broadcast.emit('chat message', msg);
        }
    });

    socket.on('join room', (room) => {
        socket.join(room);
    });

    socket.on('teste', callback => {
        console.log('user disconnected');
        console.log(typeof callback);
        if(callback) {
            callback('msg do server');
        }
    });
});

httpServer.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});