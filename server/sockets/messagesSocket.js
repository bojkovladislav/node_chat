import { messagesService } from '../services/messages.service.js';
import { v4 as uuid } from 'uuid';

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

  socket.on('create_message', async (roomId, author, content, date) => {
    try {
      const newMessage = {
        id: uuid(),
        authorName: author.name,
        authorId: author.id,
        avatar: author.avatar,
        content,
        date,
      };

      socket.emit('send_message', newMessage);

      await messagesService.createMessage(roomId, newMessage);

      socket.emit('message_created', newMessage);
      socket.to(roomId).emit('receive_message', roomId, newMessage);
    } catch (error) {
      socket.emit('failed_create_message', 'Failed to create message!');
    } 
  });
}

export const messagesSocket = {
  messagesEventHandler,
};
