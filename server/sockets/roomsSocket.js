import CRUD from '../helpers/crudoperations.js';

function handleRoomsEvent(socket) {
  socket.on('get_rooms', async (arrayOfIds) => {
    try {
      const roomsCrud = new CRUD('Rooms');
      const allRooms = !!arrayOfIds.length
        ? await roomsCrud.getAllRooms(arrayOfIds)
        : [];

      socket.emit('rooms_got', allRooms);
    } catch (error) {
      socket.emit(
        'failed_get_groups',
        'Failed to get groups! Try again later!'
      );
    }
  });
}

export const roomsSocket = {
  handleRoomsEvent,
};
