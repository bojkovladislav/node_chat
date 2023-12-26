import CRUD from '../helpers/crudoperations.js';
import admin from 'firebase-admin';

const crudMessages = new CRUD('Messages');

const createMessage = async (roomId, newMessage) => {
  const foundRoom = await crudMessages.getById(roomId);

  if (!foundRoom._fieldsProto) {
    return crudMessages.create({
      roomId,
      messages: [newMessage],
    });
  }

  return crudMessages.update(roomId, {
    messages: admin.firestore.FieldValue.arrayUnion(newMessage),
  });
};

const getMessages = async (roomId) => {
  const messagesDoc = await crudMessages.getById(roomId);

  if (!messagesDoc.exists) {
    return 'not found!';
  }

  return messagesDoc.data();
};

const createMessages = (roomId) => {
  const messages = {
    roomId,
    messages: [],
  };

  return crudMessages.create(messages, roomId);
};

const deleteMessages = (roomId) => {
  return crudMessages.delete(roomId);
};

export const messagesService = {
  getMessages,
  createMessage,
  createMessages,
  deleteMessages,
};
