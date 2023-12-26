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
} from "../../types/Rooms";
import { ID, SetState } from "../../types/PublicTypes";
import useSocketCleanup from "../hooks/useSocketCleanup";
import AddNewChat from "./ui/AddNewChat";
import Search from "./Search";
import Rooms from "./ui/Rooms";
import "@mantine/core/styles.css";

interface Props {
  rooms: RoomsType;
  setRooms: SetState<RoomsType>;
  room: RoomType | null;
  setRoom: (room: RoomType | null) => void;
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
    "send_group",
    "group_creation_failed",
    "delete_group",
    "group_deleted",
    "failed_delete_group",
    // private-rooms
    "create_private-room",
    "private-room_created",
    "send_private-room",
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
    id: ID,
  ) => {
    e.stopPropagation();
    handleRoomDeleteLocally(id);

    if (roomType === "private-room" && filteredChats) {
      const deletedUser = filteredChats.find((chat) => chat.id === id);

      if (deletedUser) deletedUser.creators = [];

      setFilteredUsers((prevUsers) => [...(prevUsers as any), deletedUser]);

      setFilteredChats(filteredChats.filter((chat) => chat.id !== id));
    }

    if (user) {
      socket.emit(`delete_${roomType}`, id, user.id, true);
    }

    socket.on(`failed_delete_${roomType}`, console.log);
  };

  const handleRoomAdd = (e: FormEvent, name: string, isPublic: boolean) => {
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

  const joinRoom = (id: ID) => {
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

  const handleRoomEnter = (currentRoom: RoomType) => {
    if (currentRoom.id === room?.id) return;

    if (rooms.every((room) => room.id !== currentRoom.id)) {
      setRooms((prevRooms) => [...prevRooms, currentRoom]);

      socket.emit("user_update_roomIds", user.id, currentRoom.id);
    }

    setIsMessagesLoading(true);
    setRoom(currentRoom);
    joinRoom(currentRoom.id);
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

    socket.emit("create_private-room", user, currentRoom);

    socket.on("private-room_creation_failed", console.log);
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
          userId={user.id}
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

  useEffect(() => {
    fetchAllRooms(user.rooms);

    // we need to send a group earlier here to deliver data to our user faster
    socket.on("send_group", handleAddRoomLocally);
    socket.on("send_private-room", (room) => {
      handleAddPrivateRoomLocally(room);
    });

    // creating a room
    socket.on("group_created", handleEndRoomCreation);
    socket.on("private-room_created", handleEndRoomCreation);
    // socket.on("private-room_for_opponent_created", handleAddRoomLocally);
  }, []);

  const skeletonRooms: RoomsType = useMemo(() => {
    return isRoomsLoading
      ? Array.from({ length: 5 }).map(() => {
          return {
            id: uuid() as ID,
            name: "Fake name",
            creators: [user.id],
          };
        })
      : rooms;
  }, [rooms]);

  return (
    <div
      className={`flex min-w-fit flex-col gap-5 overflow-y-auto overflow-x-hidden pb-3 pt-3`}
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
            handleRoomAdd={handleRoomAdd}
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
        <div className="flex w-96 flex-col gap-3">
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
          userId={user.id}
          isRoomsLoading={isRoomsLoading}
        />
      )}
    </div>
  );
};

export default LeftBar;
