import { FC, useLayoutEffect, useRef, useState } from "react";
import MessageField from "./MessageField";
import SendMessageForm from "./SendMessageForm";
import { useMediaQuery } from "@mantine/hooks";
import { User } from "../../types/Users";
import { Messages } from "../../types/Messages";
import { ID, SetState } from "../../types/PublicTypes";
import { Group, RoomType } from "../../types/Rooms";
import { ArrowLeft } from "react-bootstrap-icons";

interface Props {
  messages: Messages | null;
  setMessages: SetState<Messages | null>;
  isMessagesLoading: boolean;
  user: User;
  room: RoomType | null;
  setRoom: SetState<RoomType | null>;
}

const Chat: FC<Props> = ({
  user,
  room,
  setMessages,
  messages,
  setRoom,
  isMessagesLoading,
}) => {
  const chatWindowRef = useRef<null | HTMLDivElement>(null);
  const [sentMessageId, setSentMessageId] = useState<ID | null>(null);
  const matches = useMediaQuery("(max-width: 765px)");

  useLayoutEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`relative h-full w-full ${
        !room && "flex items-center justify-center"
      } overflow-y-hidden border-slate-700 md:border-l-2`}
    >
      {room ? (
        <>
          <div className="sticky top-0 flex items-center gap-3 border-b-2 border-slate-700 bg-slate-900 p-3">
            {/* header of the chat */}
            {matches && <ArrowLeft onClick={() => setRoom(null)} />}
            <div className="flex-column gap-5">
              <h1 className="text-lg">{room?.name}</h1>
              {(room as Group)?.members && (
                <p className="text-xxs text-slate-400">{`${(room as Group)
                  ?.members.length} member${
                  (room as Group)?.members.length > 1 ? "s" : ""
                }`}</p>
              )}
            </div>
          </div>

          {/* message field */}
          <div
            ref={chatWindowRef}
            className={`h-full flex-1 overflow-y-auto overflow-x-hidden ${
              !room && "flex items-center justify-center"
            }`}
            style={{ height: "calc(100% - 49.6px - 52.8px)" }}
          >
            <MessageField
              sentMessageId={sentMessageId}
              user={user}
              isMessagesLoading={isMessagesLoading}
              messages={messages}
              setMessages={setMessages}
              room={room}
            />
          </div>

          <SendMessageForm
            setSentMessageId={setSentMessageId}
            user={user}
            roomId={room?.id}
            isMessagesLoading={isMessagesLoading}
            setMessages={setMessages}
          />
        </>
      ) : (
        <h1>Please, select a room to start messaging</h1>
      )}
    </div>
  );
};

export default Chat;
