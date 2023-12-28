import { Skeleton } from "@mantine/core";
import { FC } from "react";
import Avatar from "./ui/Avatar";
import { PrivateRoom as PrivateRoomType } from "../../types/Rooms";

interface Props {
  currentRoom: PrivateRoomType;
  isRoomsLoading: boolean;
  loading: boolean;
}

const PrivateRoom: FC<Props> = ({ currentRoom, isRoomsLoading, loading }) => {
  return (
    <Skeleton
      visible={isRoomsLoading}
      className="flex w-fit items-center gap-2"
    >
      <Avatar
        userName={currentRoom.name}
        avatar={currentRoom.avatar}
        status={currentRoom.status}
      />
      <p>{loading ? "Creating a room..." : currentRoom.name}</p>
    </Skeleton>
  );
};

export default PrivateRoom;
