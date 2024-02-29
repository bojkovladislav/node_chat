import { SetState } from "../../../../types/PublicTypes";
import { RoomType, RoomsType } from "../../../../types/Rooms";
import { FC, useEffect } from "react";
import { User } from "../../../../types/Users";
import { socket } from "../../../adapters/socket";

interface Props {
  setRooms: SetState<RoomsType>;
  currentRoom: RoomType | null;
  user: User;
  setRoom: SetState<RoomType | null>;
  filteredChats: RoomsType | null;
  setFilteredChats: SetState<RoomsType | null>;
  title: string;
  closeModal: () => void;
  roomType: "private-room" | "group";
  room: RoomType | null;
}

const DeleteRoomForm: FC<Props> = ({
  setRooms,
  title,
  currentRoom,
  closeModal,
  setRoom,
  roomType,
  filteredChats,
  setFilteredChats,
  user,
  room,
}) => {
  const handleDeleteRoomLocally = () => {
    setRooms((rooms) =>
      rooms.filter((room: RoomType) => room.id !== currentRoom?.id),
    );

    closeModal();
    setRoom(null);
  };

  const handleRoomDelete = () => {
    if (!room) return;

    handleDeleteRoomLocally();

    if (roomType === "private-room" && filteredChats) {
      setFilteredChats((prevChats) => {
        const updatedChats =
          prevChats &&
          prevChats.map((chat) =>
            chat.id === currentRoom?.id ? { ...chat, creators: [] } : chat,
          );
        return (
          updatedChats &&
          updatedChats.filter((chat) => chat.id !== currentRoom?.id)
        );
      });
    }

    if (room.creators?.includes(user.id)) {
      socket.emit(`delete_${roomType}`, currentRoom, user.id, true);

      socket.on(`failed_delete_${roomType}`, console.log);

      return;
    }

    const newRooms = user.rooms.filter((r) => r !== room.id);

    socket.emit("user_update_field", user.id, "rooms", newRooms);
    socket.on("failed_update_user_field", console.log);
  };

  useEffect(() => {
    return () => {
      socket.off("delete_private-room");
      socket.off("delete_group");
      socket.off("failed_delete_private-room");
      socket.off("failed_delete_group");
      socket.off("user_update_field");
    };
  }, [socket]);

  return (
    <div className="flex flex-col gap-5 px-2">
      <h1>Are you sure you want to delete this room?</h1>

      <div className="flex gap-3 self-end">
        <button
          className="rounded-md border-2 border-transparent bg-white p-2 font-bold text-slate-700 transition-all duration-300 hover:bg-slate-700 hover:text-white"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="rounded-md border-[1px] border-white bg-transparent p-2 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
          onClick={handleRoomDelete}
        >
          Delete {title} room
        </button>
      </div>
    </div>
  );
};

export default DeleteRoomForm;
