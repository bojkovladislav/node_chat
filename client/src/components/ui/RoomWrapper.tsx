import { FC, MouseEvent, ReactNode } from "react";
import { Group, RoomType } from "../../../types/Rooms";
import { ID } from "../../../types/PublicTypes";
import { Trash } from "react-bootstrap-icons";
import { Skeleton } from "@mantine/core";

interface Props {
  children: ReactNode;
  showDeleteButton: boolean;
  active: boolean;
  isRoomsLoading: boolean;
  deleteRoomCondition: boolean;
  currentRoom: RoomType;
  handleRoomEnter: (currentRoom: RoomType) => void;
  handleRoomDelete: (
    roomType: "group" | "private-room",
    e: MouseEvent,
    id: ID,
  ) => void;
}

export const RoomWrapper: FC<Props> = ({
  children,
  showDeleteButton,
  active,
  deleteRoomCondition,
  isRoomsLoading,
  handleRoomDelete,
  handleRoomEnter,
  currentRoom,
}) => {
  return (
    <div
      className={`flex w-full items-center justify-between border-b border-slate-600 p-3 ${
        active && "bg-slate-700"
      } ${isRoomsLoading && "pointer-events-none"}`}
      onClick={() => deleteRoomCondition && handleRoomEnter(currentRoom)}
    >
      {children}

      {showDeleteButton && (
        <Skeleton
          visible={isRoomsLoading}
          id="skeleton-light"
          className="w-fit"
        >
          <Trash
            className="cursor-pointer"
            onClick={(e) => {
              handleRoomDelete(
                (currentRoom as Group).members ? "group" : "private-room",
                e,
                currentRoom.id,
              );
            }}
          />
        </Skeleton>
      )}
    </div>
  );
};