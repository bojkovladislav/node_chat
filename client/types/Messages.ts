import { ID } from './PublicTypes';

export type Message = {
  id: ID;
  authorName: ID;
  authorId: ID;
  avatar: string;
  content: string;
  date: string;
};

export type Messages = {
  roomId: ID;
  messages: Message[];
};
