import { usersServices } from '../services/users.service.js';
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
    privateRoomsSocket.handlePrivateRoomsEvents(socket, io);

    socket.on('join_room', (id) => {
      socket.join(id);
      console.log(`User with id: ${socket.id} joined to the room: ${id}`);
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected', socket.id);

      try {
        const disconnectedUser = await usersServices.getUserBySocketId(
          socket.id
        );

        if (disconnectedUser) {
          await usersServices.update(disconnectedUser.id, 'status', 'offline');
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('typing_trigger', (userName, roomId) => {
      socket.to(roomId).emit('typing_receive', userName);
    });

    console.log(socket.id);
  });
}
