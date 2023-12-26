import { io } from 'socket.io-client';

const URL: string = 'http://localhost:3001';

export const socket = io(URL);