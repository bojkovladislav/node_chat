import { createRoomForOpponent } from '../helpers/socketHelpers.js';
import { privateRoomsService } from '../services/private.rooms.service.js';
import { messagesService } from '../services/messages.service.js';
import { v4 as uuid } from 'uuid';

function handlePrivateRoomsEvents(socket) {
  socket.on('create_private-room', async (currentUser, opponentRoom) => {
    try {
      const opponentUserId = opponentRoom.creators[1];

      const newPrivateRoom = {
        id: uuid(),
        commonId: opponentRoom.commonId,
        opponentRoomId: uuid(),
        name: opponentRoom.name,
        avatar: opponentRoom.avatar,
        status: opponentRoom.status,
        creators: [currentUser.id, opponentUserId],
      };

      socket.emit('send_private-room', newPrivateRoom);

      await createRoomForOpponent(
        {
          ...newPrivateRoom,
          id: newPrivateRoom.opponentRoomId,
          opponentRoomId: newPrivateRoom.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          status: currentUser.status,
          creators: [opponentUserId, currentUser.id],
        },
        socket,
        opponentUserId
      );

      await privateRoomsService.createRoom(currentUser.id, newPrivateRoom);

      socket.emit('private-room_created', newPrivateRoom);
    } catch (error) {
      socket.emit('private-room_creation_failed', {
        message: 'Failed to create a private room',
      });
    }
  });

  socket.on('delete_private-room', async (room, userId, forEveryone) => {
    try {
      if (forEveryone) {
        await privateRoomsService.deleteRoomForEveryone(userId, room.id);
      } else {
        await privateRoomsService.deleteRoomForSelf(userId, room.id);
      }

      if (room.opponentRoomId) {
        try {
          await privateRoomsService.getRoom(room.opponentRoomId);
        } catch (error) {
          await deleteMessages(room.commonId);
        }
      }

      async function deleteMessages(id) {
        try {
          await messagesService.deleteMessages(id);
        } catch (error) {
          console.log('Failed to delete messages!');
        }
      }

      socket.emit('private-room_deleted', room.id);
    } catch (error) {
      socket.emit(
        'failed_delete_private-room',
        'Failed to delete group! Try again later!'
      );

      console.log(error);
    }
  });
}

export const privateRoomsSocket = {
  handlePrivateRoomsEvents,
};
