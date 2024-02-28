import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeWebSocket } from './sockets/index.js';
import { errorMiddleware } from './middlewares/errorMiddleWare.js';
import { privateRoomsRouter } from './routes/private.rooms.router.js';
import { groupsRouter } from './routes/groups.router.js';
import { roomsRouter } from './routes/rooms.router.js';
import { usersRouter } from './routes/users.router.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(cors());

app.use('/private-rooms', privateRoomsRouter);
app.use('/groups', groupsRouter);
app.use('/rooms', roomsRouter);
app.use('/users', usersRouter);

app.use(errorMiddleware);

initializeWebSocket(io);

server.listen(5000, console.log('Your server runs on http://localhost:5000'));
