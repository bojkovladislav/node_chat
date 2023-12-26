import { usersServices } from '../services/users.service.js';
import { v4 as uuid } from 'uuid';

function handleUserEvents(socket) {
  socket.on('create_user', async (name) => {
    try {
      const existingUser = await usersServices.getUserByName(name);

      if (existingUser) {
        socket.emit('user_exists', existingUser);

        return;
      }

      const newUser = {
        id: uuid(),
        name,
        rooms: [],
        avatar: 'default',
        status: 'online',
      };

      await usersServices.createUser(newUser);

      socket.emit('user_created', newUser);
    } catch (error) {
      socket.emit('user_creation_failed', {
        message: 'Failed to create user! Please try again later!',
      });
    }
  });

  socket.on('get_user', async (id) => {
    try {
      const user = await usersServices.getUserById(id);

      socket.emit('user_got', user);
    } catch (error) {
      socket.emit('failed_get_user', 'Failed to get user!');
    }
  });

  socket.on('user_update_roomIds', async (id, roomId) => {
    try {
      await usersServices.addNewRoomId(id, roomId);
    } catch (error) {
      socket.emit('failed_update_user_roomIds', 'Failed to update user!');
    }
  });
}

export const usersSocket = {
  handleUserEvents,
};
