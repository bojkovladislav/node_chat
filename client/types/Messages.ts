import { ID } from './PublicTypes';

export type Message = {
  id: ID;
  author: ID;
  content: string;
  date: string;
};

export type Messages = {
  roomId: ID;
  messages: Message[];
} | null;
