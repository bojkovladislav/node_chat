import { FC, useLayoutEffect, useRef, useState } from "react";
import MessageField from "./MessageField";
import SendMessageForm from "./SendMessageForm";
import { User } from "../../types/Users";
import { Messages } from "../../types/Messages";
import { ID, SetState } from "../../types/PublicTypes";
import { Group, RoomType } from "../../types/Rooms";

interface Props {
  messages: Messages;
  setMessages: SetState<Messages>;
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
  isMessagesLoading,
}) => {
  const chatWindowRef = useRef<null | HTMLDivElement>(null);
  const [sentMessageId, setSentMessageId] = useState<ID | null>(null);

  useLayoutEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative w-full overflow-y-hidden border-l-2 border-slate-700">
      {room && (
        <div className="sticky top-0 border-b-2 border-slate-700 bg-slate-900 p-3">
          {/* header of the chat */}
          <div className="flex-column gap-5">
            <h1 className="text-lg">{room?.name}</h1>
            {(room as Group)?.members && (
              <p className="text-xxs text-slate-400">{`${(room as Group)?.members
                .length} member${(room as Group)?.members.length > 1 ? "s" : ""}`}</p>
            )}
          </div>
        </div>
      )}

      {/* message field */}
      <div
        ref={chatWindowRef}
        className={`h-full flex-1 overflow-y-auto overflow-x-hidden ${
          !room && "flex items-center justify-center"
        }`}
        style={{ height: "calc(100% - 49.6px - 52.8px)" }}
      >
        {room ? (
          <MessageField
            sentMessageId={sentMessageId}
            user={user}
            isMessagesLoading={isMessagesLoading}
            messages={messages}
            setMessages={setMessages}
            room={room}
          />
        ) : (
          <h1>Please, select a room to start messaging</h1>
        )}
      </div>

      {room && (
        <SendMessageForm
          setSentMessageId={setSentMessageId}
          user={user}
          roomId={room?.id}
          isMessagesLoading={isMessagesLoading}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default Chat;
