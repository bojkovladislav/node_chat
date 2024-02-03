import {
  FC,
  useEffect,
  useState,
  FormEvent,
  MouseEvent,
  useMemo,
  useCallback,
} from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket";
import { User } from "../../types/Users";
import {
  RoomType,
  RoomsType,
  PrivateRooms,
  PrivateRoom,
  Group,
} from "../../types/Rooms";
import { ID, SetState, USER_STATUS } from "../../types/PublicTypes";
import useSocketCleanup from "../hooks/useSocketCleanup";
import AddNewChat from "./ui/AddNewChat";
import Search from "./Search";
import Rooms from "./ui/Rooms";
import "@mantine/core/styles.css";

interface Props {
  rooms: RoomsType;
  setRooms: SetState<RoomsType>;
  room: RoomType | null;
  setRoom: SetState<RoomType | null>;
  setIsMessagesLoading: SetState<boolean>;
  user: User;
}

const LeftBar: FC<Props> = ({
  rooms,
  setRooms,
  room,
  setRoom,
  user,
  setIsMessagesLoading,
}) => {
  const [isCreateNewChatTriggered, setIsCreateNewChatTriggered] =
    useState(false);
  const [roomName, setRoomName] = useState("");
  const [inputError, setInputError] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const [addedRoomId, setAddedRoomId] = useState<ID | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<PrivateRooms>(null);
  const [filteredChats, setFilteredChats] = useState<RoomsType | null>(null);
  const [isFilteredRoomsLoading, setIsFilteredRoomsLoading] = useState(false);
  const [query, setQuery] = useState("");

  useSocketCleanup([
    // rooms
    "create_rooms",
    "get_rooms",
    "rooms_got",
    "join_room",
    // groups
    "create_group",
    "group_created",
    "update_group_members",
    "failed_update_members",
    "send_group",
    "group_creation_failed",
    "delete_group",
    "group_deleted",
    "failed_delete_group",
    // private-rooms
    "create_private-room",
    "private-room_created",
    "send_private-room",
    "send_private-room_for_opponent",
    "private-room_for_opponent_created",
    "private-room_creation_failed",
    "private-room_existed",
    "private-room_for_opponent_existed",
    "delete_private-room",
    "failed_delete_private-room",
    // user
    "user_update_roomIds",
  ]);

  const handleAddRoomLocally = (room: RoomType) => {
    setAddedRoomId(room.id);

    setRooms((prevRooms) => [room, ...prevRooms]);
  };

  const handleAddPrivateRoomLocally = (room: RoomType) => {
    handleAddRoomLocally(room);

    setFilteredChats((prevChats) => prevChats && [...prevChats, room]);
  };

  const handleRoomDeleteLocally = (id: ID) => {
    if (room && id === room.id) {
      setRoom(null);
    }

    setRooms(rooms.filter((room: RoomType) => room.id !== id));
  };

  const handleRoomDelete = (
    roomType: "group" | "private-room",
    e: MouseEvent,
    currentRoom: RoomType,
  ) => {
    e.stopPropagation();

    handleRoomDeleteLocally(currentRoom.id);

    if (roomType === "private-room" && filteredChats) {
      setFilteredChats((prevChats) => {
        const updatedChats =
          prevChats &&
          prevChats.map((chat) =>
            chat.id === currentRoom.id ? { ...chat, creators: [] } : chat,
          );
        return (
          updatedChats &&
          updatedChats.filter((chat) => chat.id !== currentRoom.id)
        );
      });
    }

    if (user) {
      socket.emit(`delete_${roomType}`, currentRoom, user.id, true);
    }

    socket.on(`failed_delete_${roomType}`, console.log);
  };

  const handleGroupAdd = (e: FormEvent, name: string, isPublic: boolean) => {
    e.preventDefault();

    if (!name.length) {
      setInputError("name of the chat is required");

      return;
    }

    if (rooms.some((room: RoomType) => room.name === name)) {
      setInputError(`The room with name "${name}" already exists`);

      return;
    }

    socket.emit("create_group", name, [user.id], [user.id], isPublic, user.id);

    socket.on("group_creation_failed", (message) => console.log(message));

    setIsCreateNewChatTriggered(false);
    setRoomName("");
    setInputError("");
  };

  const joinRoom = (id: ID | string) => {
    if (!id) return;

    socket.emit("join_room", id);
  };

  const handleInputChange = (value: string) => {
    setRoomName(value);
    setInputError("");
  };

  const handleOpenRoomCreation = () => {
    setIsCreateNewChatTriggered(true);
  };

  const handleRoomEnterLocally = (currentRoom: PrivateRoom) => {
    if (currentRoom.id === room?.id) return;

    setRoom(currentRoom);
    joinRoom(currentRoom.commonId);
  };

  const handleRoomEnter = (currentRoom: RoomType) => {
    if (currentRoom.id === room?.id) return;

    const isGroup = !!(currentRoom as Group).members;
    let roomToUpdate = currentRoom;

    if (rooms.every((room) => room.id !== currentRoom.id)) {
      setRooms((prevRooms) => [...prevRooms, currentRoom]);

      socket.emit("user_update_roomIds", user.id, currentRoom.id);
    }

    if (isGroup && !(currentRoom as Group).members.includes(user.id)) {
      const newRoom = {
        ...currentRoom,
        members: [...(currentRoom as Group).members, user.id],
      };

      roomToUpdate = newRoom;

      socket.emit("update_group_members", currentRoom.id, user.id);
      socket.on("failed_update_members", console.log);
    }

    setIsMessagesLoading(true);
    setRoom(roomToUpdate);
    joinRoom(isGroup ? currentRoom.id : (currentRoom as PrivateRoom).commonId);
  };

  const fetchAllRooms = (roomIds: ID[]) => {
    socket.emit("get_rooms", roomIds);

    socket.on("rooms_got", (rooms) => {
      setIsRoomsLoading(false);
      setRooms(rooms);
    });
  };

  const handleEndRoomCreation = (room: RoomType) => {
    setRoom(room);
    setIsMessagesLoading(false);

    setAddedRoomId(null);
  };

  const handlePrivateRoomEnter = async (currentRoom: PrivateRoom) => {
    const foundChat = filteredChats?.find(
      (chat) => chat.name === currentRoom.name,
    );

    if (foundChat) {
      handleRoomEnter(foundChat);

      return;
    }

    const newLocalRoom = {
      ...currentRoom,
      id: uuid() as ID,
      commonId: uuid() as ID,
      creators: [user.id, currentRoom.id],
    };

    handleAddPrivateRoomLocally(newLocalRoom);
    handleEndRoomCreation(newLocalRoom);
  };

  const renderFilteredRooms = useCallback(
    (rooms: RoomsType | null, roomsType: "chats" | "users") =>
      rooms && !!rooms.length ? (
        <Rooms
          rooms={rooms}
          handleRoomDelete={handleRoomDelete}
          handleRoomEnter={
            roomsType === "users" ? handlePrivateRoomEnter : handleRoomEnter
          }
          addedRoomId={addedRoomId}
          roomId={room?.id}
          user={user}
          isRoomsLoading={isRoomsLoading}
        />
      ) : (
        <p className="ml-5 text-sm">{`Nothing was found in ${roomsType}`}</p>
      ),
    [
      user.rooms,
      handleRoomDelete,
      handleRoomEnter,
      handlePrivateRoomEnter,
      addedRoomId,
      room?.id,
      isRoomsLoading,
    ],
  );

  // So here we are just entering the new private room created locally
  useEffect(() => {
    if (addedRoomId) {
      const brandNewRoom = rooms.find((room) => room.id === addedRoomId);

      if (brandNewRoom) {
        handleRoomEnterLocally(brandNewRoom as PrivateRoom);
      }
    }
  }, [rooms]);

  useEffect(() => {
    fetchAllRooms(user.rooms);

    // we need to send a group earlier here to deliver data to our user faster
    socket.on("send_group", handleAddRoomLocally);
    socket.on("group_created", handleEndRoomCreation);
  }, []);

  const skeletonRooms: RoomsType = useMemo(() => {
    return isRoomsLoading
      ? Array.from({ length: 5 }).map(() => {
          return {
            id: uuid() as ID,
            commonId: uuid() as ID,
            opponentRoomId: uuid() as ID,
            opponentUserId: uuid() as ID,
            name: "Fake name",
            creators: [user.id],
            avatar: "",
            status: USER_STATUS.OFFLINE,
          };
        })
      : rooms;
  }, [rooms]);

  return (
    <div
      className={`flex w-fit flex-col gap-5 overflow-y-auto overflow-x-hidden pb-3 pt-3 md:min-w-fit`}
    >
      <div className="mx-5 flex flex-col gap-7">
        <Search
          query={query}
          setQuery={setQuery}
          setFilteredUsers={setFilteredUsers}
          setFilteredChats={setFilteredChats}
          setIsFilteredRoomsLoading={setIsFilteredRoomsLoading}
          rooms={rooms}
        />

        {!query.length && (
          <AddNewChat
            handleOpenRoomCreation={handleOpenRoomCreation}
            handleRoomAdd={handleGroupAdd}
            isCreateNewChatTriggered={isCreateNewChatTriggered}
            isPublic={isPublic}
            roomName={roomName}
            setIsCreateNewChatTriggered={setIsCreateNewChatTriggered}
            setIsPublic={setIsPublic}
            handleInputChange={handleInputChange}
            inputError={inputError}
            isRoomsLoading={isRoomsLoading}
          />
        )}
      </div>
      {!!query.length ? (
        <div className="flex w-screen flex-col gap-3 md:w-96">
          {["chats", "users"].map((roomType, i) => (
            <div key={i} className="flex flex-col gap-1">
              <h1 className="ml-5 text-lg">
                {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
              </h1>
              {isFilteredRoomsLoading ? (
                <p className="ml-5 text-sm text-slate-500">{`Loading ${roomType}...`}</p>
              ) : (
                renderFilteredRooms(
                  roomType === "chats" ? filteredChats : filteredUsers,
                  roomType as "chats" | "users",
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        <Rooms
          rooms={skeletonRooms}
          handleRoomDelete={handleRoomDelete}
          handleRoomEnter={handleRoomEnter}
          addedRoomId={addedRoomId}
          roomId={room?.id}
          user={user}
          isRoomsLoading={isRoomsLoading}
        />
      )}
    </div>
  );
};

export default LeftBar;
