import express from 'express';
import { catchError } from '../middlewares/catchError.js';
import { usersController } from '../controllers/users.controller.js';

export const usersRouter = express.Router();

// usersRouter.post(`/`, catchError(usersController.createUser));
// usersRouter.get(`/`, catchError(usersController.getUsers));
// usersRouter.get(`/:id`, catchError(usersController.getUserById));

usersRouter.post('/', catchError(usersController.getUsersByMemberIds));
usersRouter.post('/friends', catchError(usersController.getFriends));
