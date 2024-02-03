import { messagesService } from '../services/messages.service.js';
import { v4 as uuid } from 'uuid';
import { privateRoomsService } from '../services/private.rooms.service.js';
import { createRoomForOpponent } from '../helpers/socketHelpers.js';

function messagesEventHandler(socket) {
  socket.on('create_messages', async (roomId) => {
    try {
      await messagesService.createMessages(roomId);
    } catch (error) {
      socket.emit('failed_create_messages', 'Failed to create messages!');
    }
  });

  socket.on('get_messages', async (roomId) => {
    try {
      const messages = await messagesService.getMessages(roomId);

      socket.emit('messages_got', messages);
    } catch (error) {
      socket.emit('failed_get_messages', 'Failed to get messages!');
    }
  });

  socket.on(
    'create_message',
    async (room, author, content, date, repliedMessage) => {
      try {
        const newMessage = {
          id: uuid(),
          authorName: author.name,
          authorId: author.id,
          avatar: author.avatar,
          content,
          date,
          repliedMessage: repliedMessage || null,
        };

        socket.emit('send_message', newMessage);

        const isRoomPrivate = room.commonId !== undefined;
        const currentRoomId = isRoomPrivate ? room.commonId : room.id;

        if (isRoomPrivate) {
          await handleExistingChat(room, author);
        }

        await messagesService.createMessage(currentRoomId, newMessage);

        socket.emit('message_created', newMessage);
        socket
          .to(currentRoomId)
          .emit('receive_message', currentRoomId, newMessage);
      } catch (error) {
        socket.emit('failed_create_message', 'Failed to create message!');
      }
    }
  );

  async function handleExistingChat(room, author) {
    const existingMessages = await messagesService.findMessages(room.commonId);
    const opponentUserId = room.creators.find(
      (creator) => creator !== author.id
    );

    const newPrivateRoom = createNewPrivateRoom(room, author, opponentUserId);

    if (!existingMessages.exists) {
      try {
        socket.emit('send_private-room', newPrivateRoom);

        await createRoomForOpponent(
          generateOpponentRoom(newPrivateRoom, author),
          socket,
          opponentUserId
        );

        await privateRoomsService.createRoom(author.id, newPrivateRoom);

        socket.emit('private-room_created', newPrivateRoom);
      } catch (error) {
        console.log(error);
        console.log('Failed to create private rooms!');
      }
    }

    if (room.opponentRoomId) {
      try {
        await privateRoomsService.getRoom(room.opponentRoomId);
      } catch (error) {
        try {
          await createRoomForOpponent(
            generateOpponentRoom(room, author),
            socket,
            opponentUserId
          );
        } catch (error) {
          console.log(error, 'Error creating a room for opponent');
        }
      }
    }
  }

  function createNewPrivateRoom(room, author, opponentUserId) {
    return {
      id: uuid(),
      commonId: room.commonId,
      opponentRoomId: uuid(),
      name: room.name,
      avatar: room.avatar,
      status: room.status,
      creators: [author.id, opponentUserId],
    };
  }

  function generateOpponentRoom(currentRoom, author) {
    return {
      ...currentRoom,
      id: currentRoom.opponentRoomId,
      opponentRoomId: currentRoom.id,
      name: author.name,
      avatar: author.avatar,
      status: author.status,
    };
  }

  socket.on('delete_message', async (currentRoomId, messageId) => {
    try {
      socket.to(currentRoomId).emit('receive_deleted_message-id', messageId);

      await messagesService.deleteMessage(currentRoomId, messageId);
    } catch (error) {
      console.log(error);
      console.log(`Unable to delete the message with id: ${messageId}`);
    }
  });

  socket.on(
    'update_message',
    async (currentRoomId, messageId, updatedContent) => {
      try {
        socket
          .to(currentRoomId)
          .emit('receive_updated_message', messageId, updatedContent);

        // here we are actually doing it on the server
        await messagesService.updateMessage(
          currentRoomId,
          messageId,
          updatedContent
        );
      } catch (error) {
        console.log(`Failed to update the message with id ${messageId}`);
      }
    }
  );
}

export const messagesSocket = {
  messagesEventHandler,
};
