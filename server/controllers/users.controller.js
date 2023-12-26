import ApiError from '../exceptions/api.error.js';
import { usersServices } from '../services/users.service.js';

const getFilteredUsers = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    throw ApiError.badRequest('You need to provide a name!');
  }

  const filteredUsers = await usersServices.getFilteredUsers(name);

  res.send({
    message: "You've successfully received filtered users!",
    users: filteredUsers,
  });
};

export const usersController = {
  getFilteredUsers,
};
