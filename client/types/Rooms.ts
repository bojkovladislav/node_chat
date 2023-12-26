import { ID } from './PublicTypes';

export type PrivateRoom = {
  id: ID;
  name: string;
  creators: ID[];
};

export type Group = PrivateRoom & {
  members: ID[];
  public: boolean;
};

export type Groups = Group[] | null;
export type PrivateRooms = PrivateRoom[] | null;

export type RoomType = PrivateRoom | Group;

export type RoomsType = RoomType[];
