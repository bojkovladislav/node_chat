import { FC, MouseEvent } from "react";
import {
  RoomType,
  Group as GroupType,
  RoomsType,
  PrivateRoom as PrivateRoomType,
} from "../../../types/Rooms";
import Group from "../Group";
import { RoomWrapper } from "./RoomWrapper";
import { ID } from "../../../types/PublicTypes";
import { User } from "../../../types/Users";
import PrivateRoom from "../PrivateRoom";

interface Props {
  rooms: RoomsType;
  handleRoomEnter: (currentRoom: any) => void | Promise<void>;
  handleRoomDelete: (
    roomType: "group" | "private-room",
    e: MouseEvent,
    id: ID,
  ) => void;
  roomId?: ID;
  user: User;
  addedRoomId: ID | null;
  isRoomsLoading: boolean;
}

const Rooms: FC<Props> = ({
  rooms,
  handleRoomEnter,
  handleRoomDelete,
  roomId,
  user,
  addedRoomId,
  isRoomsLoading,
}) => {
  return (
    <div className="flex w-screen flex-col gap-0 md:w-96">
      {rooms.map((currentRoom: RoomType) => {
        const { id, name, creators, avatar } = currentRoom;

        return (currentRoom as GroupType).members !== undefined ? (
          <RoomWrapper
            key={id}
            handleRoomEnter={handleRoomEnter}
            handleRoomDelete={handleRoomDelete}
            active={roomId === currentRoom.id}
            currentRoom={currentRoom}
            deleteRoomCondition={addedRoomId !== currentRoom.id}
            showDeleteButton={creators.includes(user.id)}
            isRoomsLoading={isRoomsLoading}
          >
            <Group
              avatar={avatar}
              loading={addedRoomId === currentRoom.id}
              name={name}
              isRoomsLoading={isRoomsLoading}
            />
          </RoomWrapper>
        ) : (
          <RoomWrapper
            key={id}
            handleRoomEnter={handleRoomEnter}
            handleRoomDelete={handleRoomDelete}
            active={roomId === currentRoom.id}
            currentRoom={currentRoom}
            deleteRoomCondition={addedRoomId !== currentRoom.id}
            showDeleteButton={creators.includes(user.id)}
            isRoomsLoading={isRoomsLoading}
          >
            <PrivateRoom
              currentRoom={currentRoom as PrivateRoomType}
              loading={addedRoomId === currentRoom.id}
              isRoomsLoading={isRoomsLoading}
            />
          </RoomWrapper>
        );
      })}
    </div>
  );
};

export default Rooms;
