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

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
}

// Correct Structure of a chat app:
// So basically during the session user has his unique socket id (or session id)
// As I understand on connection event, I need to save this id locally as well as
//  to the database and then I can access it throughout my application

// When user has already socketID:
// On group creation, I need to send this group only to that specific user.

// Active users:
// when user disconnects just update the user status to be offline

// Notify users when user is typing.
// 1) so on the client side when user's typing a message (onKeyDown) I need to issue the event called typing.
// const handleTyping = () => socket.emit('typing', '${currentUser} is typing...')
// 2) then on the server side, I need to send this message to the room
// 3) receive this message on the client and do something like this:
// useEffect(() => {
//  socket.on('typingResponse', (data) => setTypingStatus(data));
// }, [])
// And then I can log this information dynamically
