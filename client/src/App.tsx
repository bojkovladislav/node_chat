import { useEffect, useState } from "react";
import Chat from "./components/Chat.tsx";
import Auth from "./components/Auth.tsx";
import {
  getItemFromLS,
  removeItemFromLS,
  setItemToLS,
} from "./helpers/localStorageHelpers.ts";
import LeftBar from "./components/LeftBar.tsx";
import { Group, PrivateRoom, RoomType, RoomsType } from "../types/Rooms.ts";
import { User } from "../types/Users.ts";
import { socket } from "./socket.ts";
import { useMediaQuery } from "@mantine/hooks";
import { Messages } from "../types/Messages.ts";
import useSocketCleanup from "./hooks/useSocketCleanup.ts";
import { BoxArrowRight } from "react-bootstrap-icons";

import { useResizable } from "react-resizable-layout";
import SplitterForResize from "./components/ui/SplitterForResize.tsx";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<RoomsType>([]);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [messages, setMessages] = useState<Messages | null>(null);
  const matches = useMediaQuery("(max-width: 765px)");
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const userFromLS: User = getItemFromLS("user");

  const {
    isDragging: isLeftBarDragging,
    position: leftBarCurrentWidth,
    splitterProps: leftBarDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 500,
    min: 315,
    max: 500,
  });

  useSocketCleanup([
    "create_user",
    "user_created",
    "user_exists",
    "user_creation_failed",
    "get_user",
    "failed_get_messages",
  ]);

  const createUser = (name: string) => {
    const updateUserData = (data: User) => {
      setUser(data);
      setItemToLS("user", data);
    };

    const handleUserCreation = (newUser: User) => {
      updateUserData(newUser);
    };

    const handleUserExists = (user: User) => {
      updateUserData(user);
    };

    const handleUserCreationFailed = (message: string) => {
      console.log("User creation failed!: ", message);
    };

    socket.emit("create_user", name);
    socket.on("user_created", handleUserCreation);
    socket.on("user_exists", handleUserExists);
    socket.on("user_creation_failed", handleUserCreationFailed);
  };

  const updateUser = () => {
    socket.emit("get_user", userFromLS.id);

    socket.on("user_got", (newUser) => {
      setUser(newUser);
      setItemToLS("user", newUser);
    });
  };

  const loadMessages = () => {
    if (room) {
      socket.emit(
        "get_messages",
        (room as Group).members ? room.id : (room as PrivateRoom).commonId,
      );

      socket.on("messages_got", (messages) => {
        setIsMessagesLoading(false);
        setMessages(messages);
      });
    }
  };

  const handleLogOut = () => {
    socket.emit("user_disconnect", user?.id);

    setUser(null);
    removeItemFromLS("user");
    setMessages(null);
    setRoom(null);
  };

  useEffect(() => {
    if (userFromLS) updateUser();

    loadMessages();

    socket.on("failed_get_messages", () => {
      setIsMessagesLoading(false);
      setMessages(null);
    });
  }, [room]);

  return (
    <div
      className={`flex md:pb-10 ${
        !user && "items-center justify-center"
      } h-screen flex-col`}
    >
      {!userFromLS ? (
        <Auth createUser={createUser} />
      ) : (
        <>
          {user ? (
            <>
              <header
                className={`flex items-center justify-between border-b-2 border-slate-600 bg-slate-800 p-5 md:px-52 md:py-10 ${
                  matches && room ? "hidden" : "block"
                }`}
              >
                <h1 className="text-xl font-bold">Chat App</h1>
                <BoxArrowRight
                  onClick={handleLogOut}
                  className="cursor-pointer text-xl"
                />
              </header>
              <main
                className={`flex h-full flex-col ${
                  user && "md:min-h-[500px] md:px-52"
                }`}
              >
                <div className="flex h-full md:rounded-md md:rounded-tl-none md:rounded-tr-none md:border-b-2 md:border-l-2 md:border-r-2 md:border-slate-600">
                  {matches ? (
                    !room ? (
                      <LeftBar
                        user={user}
                        setRooms={setRooms}
                        setIsMessagesLoading={setIsMessagesLoading}
                        rooms={rooms}
                        room={room}
                        setRoom={setRoom}
                      />
                    ) : (
                      <Chat
                        user={user}
                        messages={messages}
                        isMessagesLoading={isMessagesLoading}
                        setMessages={setMessages}
                        room={room}
                        setRoom={setRoom}
                      />
                    )
                  ) : (
                    <>
                      <div style={{ width: leftBarCurrentWidth }}>
                        <LeftBar
                          user={user}
                          leftBarCurrentWidth={leftBarCurrentWidth}
                          setRooms={setRooms}
                          setIsMessagesLoading={setIsMessagesLoading}
                          rooms={rooms}
                          room={room}
                          setRoom={setRoom}
                        />
                      </div>
                      <SplitterForResize
                        isDragging={isLeftBarDragging}
                        {...leftBarDragBarProps}
                      />
                      <Chat
                        user={user}
                        messages={messages}
                        isMessagesLoading={isMessagesLoading}
                        setMessages={setMessages}
                        room={room}
                        setRoom={setRoom}
                      />
                    </>
                  )}
                </div>
              </main>
            </>
          ) : (
            <h1>The Chat Is Loading...</h1>
          )}
        </>
      )}
    </div>
  );
}

// TODO:

//? Private room functionality:
// Check also tasks on the server side

// on mobile version fix fetching rooms

//? FEATURES:
// Add settings to groups

export default App;
