import { useEffect, useState } from "react";
import Chat from "./components/Chat.tsx";
import Auth from "./components/Auth.tsx";
import {
  getItemFromLS,
  removeItemFromLS,
  setItemToLS,
} from "./helpers/localStorageHelpers.ts";
import LeftBar from "./components/LeftBar.tsx";
import { RoomType, RoomsType } from "../types/Rooms.ts";
import { User } from "../types/Users.ts";
import { socket } from "./socket.ts";
import { useMediaQuery } from "@mantine/hooks";
import { Messages } from "../types/Messages.ts";
import useSocketCleanup from "./hooks/useSocketCleanup.ts";
import { BoxArrowRight } from "react-bootstrap-icons";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<RoomsType>([]);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [messages, setMessages] = useState<Messages | null>(null);
  const matches = useMediaQuery("(max-width: 765px)");
  useSocketCleanup([
    "create_user",
    "user_created",
    "user_exists",
    "user_creation_failed",
    "get_user",
  ]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const userFromLS: User = getItemFromLS("user");

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
      socket.emit("get_messages", room.id);

      socket.on("messages_got", (messages) => {
        setIsMessagesLoading(false);
        setMessages(messages);
      });
    }
  };

  const handleLogOut = () => {
    setUser(null);
    removeItemFromLS("user");
    setMessages(null);
    setRoom(null);
  };

  useEffect(() => {
    if (userFromLS) updateUser();
  }, [room]);

  useEffect(() => {
    loadMessages();
  }, [room]);

  return (
    <div
      className={`flex ${
        !user && "items-center justify-center"
      } h-screen flex-col md:h-[600px]`}
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
              <main className={`flex h-full flex-col ${user && "md:px-52"}`}>
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
                      <LeftBar
                        user={user}
                        setRooms={setRooms}
                        setIsMessagesLoading={setIsMessagesLoading}
                        rooms={rooms}
                        room={room}
                        setRoom={setRoom}
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
// Check how it works for opponent:
//  - First of all, I need to add socket id to user credentials
//  - Then I need to access that socket id in privateRoomsSocket and send that private room to recipient
//  - That's it

//? FEATURES:
// 2) add responsiveness to that rooms block
// 3) add settings to groups

export default App;
