import CRUD from '../helpers/crudoperations.js';
import ApiError from '../exceptions/api.error.js';
import admin from 'firebase-admin';

const usersCrud = new CRUD('Users');

const createUser = (newUser) => {
  return usersCrud.create(newUser, newUser.id);
};

const getUsers = () => {
  return usersCrud.getAll();
};

const getUserByName = async (name) => {
  const users = await usersCrud.getByName(name);

  return users[0];
};

const getUserById = async (id) => {
  const foundUserDoc = await usersCrud.getById(id);

  if (!foundUserDoc.exists) {
    throw ApiError.notFound();
  }

  return foundUserDoc.data();
};

const addNewRoomId = async (id, newRoomId) => {
  return usersCrud.update(id, {
    rooms: admin.firestore.FieldValue.arrayUnion(newRoomId),
  });
};

const removeRoomId = (id, roomId) => {
  return usersCrud.update(id, {
    rooms: admin.firestore.FieldValue.arrayRemove(roomId),
  });
};

const getFilteredUsers = (name) => {
  return usersCrud.getByName(name);
};

const update = (id, field, newValue) => {
  return usersCrud.update({ id, [field]: newValue });
};

export const usersServices = {
  createUser,
  getUsers,
  getUserById,
  getUserByName,
  addNewRoomId,
  removeRoomId,
  getFilteredUsers,
  update,
};
