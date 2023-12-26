import { groupsSocket } from './groupsSocket.js';
import { messagesSocket } from './messagesSocket.js';
import { privateRoomsSocket } from './privateRoomsSocket.js';
import { roomsSocket } from './roomsSocket.js';
import { usersSocket } from './usersSocket.js';

export function initializeWebSocket(io) {
  io.on('connection', (socket) => {
    usersSocket.handleUserEvents(socket);
    roomsSocket.handleRoomsEvent(socket);
    groupsSocket.handleGroupsEvent(socket);
    messagesSocket.messagesEventHandler(socket);
    privateRoomsSocket.handlePrivateRoomsEvents(socket);

    socket.on('join_room', (id) => {
      socket.join(id);
      console.log(`User with id: ${socket.id} joined to the room: ${id}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
}
