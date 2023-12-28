import { privateRoomsService } from '../services/private.rooms.service.js';
import { v4 as uuid } from 'uuid';

function handlePrivateRoomsEvents(socket, io) {
  socket.on('create_private-room', async (currentUser, opponent) => {
    try {
      const newPrivateRoom = {
        id: uuid(),
        name: opponent.name,
        avatar: opponent.avatar,
        status: opponent.status,
        creators: [currentUser.id, opponent.id],
      };

      // const roomForOpponent = {
      //   ...newPrivateRoom,
      //   name: currentUser.name,
      //   avatar: currentUser.avatar,
      //   status: currentUser.status,
      // };

      socket.emit('send_private-room', newPrivateRoom);

      const existingRoom = await privateRoomsService.createRoom(
        currentUser.id,
        newPrivateRoom
      );

      // const existingRoomForOpponent = await privateRoomsService.createRoom(
      //   opponent.id,
      //   roomForOpponent
      // );

      socket.emit('private-room_created', newPrivateRoom);
      // socket.emit('private-room_for_opponent_created', roomForOpponent);

      if (existingRoom) {
        socket.emit('private-room_existed', existingRoom);

        return;
      }

      // if (existingRoomForOpponent) {
      //   socket.emit(
      //     'private-room_for_opponent_existed',
      //     existingRoomForOpponent
      //   );

      //   return;
      // }
    } catch (error) {
      socket.emit('private-room_creation_failed', {
        message: 'Failed to create a private room',
      });

      console.log(error);
    }
  });

  socket.on('delete_private-room', async (roomId, userId, forEveryone) => {
    try {
      if (forEveryone) {
        await privateRoomsService.deleteRoomForEveryone(userId, roomId);
      } else {
        await privateRoomsService.deleteRoomForSelf(userId, roomId);
      }

      socket.emit('private-room_deleted', roomId);
    } catch (error) {
      socket.emit(
        'failed_delete_private-room',
        'Failed to delete group! Try again later!'
      );
    }
  });
}

export const privateRoomsSocket = {
  handlePrivateRoomsEvents,
};
