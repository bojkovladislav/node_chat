import { FC, MouseEvent } from "react";
import { RoomType, Group as GroupType, RoomsType } from "../../../types/Rooms";
import Group from "../Group";
import { RoomWrapper } from "./RoomWrapper";
import PrivateRoom from "../PrivateRoom";
import { ID } from "../../../types/PublicTypes";

interface Props {
  rooms: RoomsType;
  handleRoomEnter: (currentRoom: RoomType) => void;
  handleRoomDelete: (
    roomType: "group" | "private-room",
    e: MouseEvent,
    id: ID,
  ) => void;
  roomId?: ID;
  userId: ID;
  addedRoomId: ID | null;
  isRoomsLoading: boolean;
}

const Rooms: FC<Props> = ({
  rooms,
  handleRoomEnter,
  handleRoomDelete,
  roomId,
  userId,
  addedRoomId,
  isRoomsLoading,
}) => {
  return (
    <div className="flex w-96 flex-col gap-0">
      {rooms.map((currentRoom: RoomType) => {
        const { id, name, creators } = currentRoom;

        return (currentRoom as GroupType).members !== undefined ? (
          <RoomWrapper
            key={id}
            handleRoomEnter={handleRoomEnter}
            handleRoomDelete={handleRoomDelete}
            active={roomId === currentRoom.id}
            currentRoom={currentRoom}
            deleteRoomCondition={addedRoomId !== currentRoom.id}
            showDeleteButton={creators.includes(userId)}
            isRoomsLoading={isRoomsLoading}
          >
            <Group
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
            showDeleteButton={creators.includes(userId)}
            isRoomsLoading={isRoomsLoading}
          >
            <PrivateRoom
              name={name}
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
