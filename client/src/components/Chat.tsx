import { FC, useEffect, useRef, useState } from "react";
import MessageField from "./MessageField";
import SendMessageForm from "./SendMessageForm";
import { useMediaQuery } from "@mantine/hooks";
import { User } from "../../types/Users";
import { Messages } from "../../types/Messages";
import { ID, SetState } from "../../types/PublicTypes";
import { Group, RoomType } from "../../types/Rooms";
import { ArrowLeft } from "react-bootstrap-icons";
import NewMessageNotification from "./ui/NewMessageNotification";
import ScrollToBottomArrow from "./ui/ScrollToBottomArrow";

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
  const chatWindowRef = useRef<any>(null);
  const [sentMessageId, setSentMessageId] = useState<ID | null>(null);
  const matches = useMediaQuery("(max-width: 765px)");
  const [newMessageFromOpponentId, setNewMessageFromOpponentId] =
    useState<ID | null>(null);
  const [isNewMessagesVisible, setIsNewMessagesVisible] = useState(false);
  const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);

  const isUserNearBottom = useRef<boolean>(false);
  const isOverflowTriggered = useRef<boolean>(false);

  const scrollChatToBottom = (smooth: boolean = false) => {
    if (chatWindowRef.current && !isMessagesLoading) {
      const chatWindow = chatWindowRef.current;

      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });

      setNewMessageFromOpponentId(null);
    }
  };

  const handleScroll = () => {
    if (chatWindowRef.current) {
      const chatWindow = chatWindowRef.current;
      const threshold = 100;
      const isBottomNearViewportBottom =
        chatWindow.scrollTop + chatWindow.clientHeight >=
        chatWindow.scrollHeight - threshold;
      const isOverflowScrolling =
        chatWindow.scrollHeight > chatWindow.clientHeight;

      isUserNearBottom.current = isBottomNearViewportBottom;
      isOverflowTriggered.current = isOverflowScrolling;

      if (isBottomNearViewportBottom || !isOverflowScrolling) {
        setIsNewMessagesVisible(false);
        setIsUserScrollingUp(false);
      } else {
        setIsUserScrollingUp(true);
      }
    }
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [isMessagesLoading, sentMessageId]);

  useEffect(() => {
    if (newMessageFromOpponentId && isOverflowTriggered.current) {
      isUserNearBottom.current
        ? scrollChatToBottom(true)
        : setIsNewMessagesVisible(true);
    }
  }, [newMessageFromOpponentId, isUserNearBottom]);

  return (
    <div
      className={`relative flex h-full w-full flex-col ${
        !room && "flex items-center justify-center"
      } overflow-y-hidden border-slate-700 md:border-l-2`}
    >
      {room ? (
        <>
          <div className="flex items-center gap-3 border-b-2 border-slate-700 bg-slate-900 p-3">
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
            className={`${
              isMessagesLoading && "overflow-y-hidden"
            } flex-1 overflow-x-hidden ${
              !room && "flex items-center justify-center"
            }`}
            onScroll={handleScroll}
          >
            <MessageField
              sentMessageId={sentMessageId}
              user={user}
              setNewMessageFromOpponentId={setNewMessageFromOpponentId}
              isMessagesLoading={isMessagesLoading}
              messages={messages}
              setMessages={setMessages}
              room={room}
            />
          </div>

          <SendMessageForm
            setSentMessageId={setSentMessageId}
            user={user}
            roomId={!!(room as Group).members ? room.id : room.commonId}
            isMessagesLoading={isMessagesLoading}
            setMessages={setMessages}
          />
        </>
      ) : (
        <h1>Please, select a room to start messaging</h1>
      )}

      <NewMessageNotification
        isNewMessagesVisible={isNewMessagesVisible}
        scrollChatToBottom={scrollChatToBottom}
      />

      <ScrollToBottomArrow
        isUserScrollingUp={isUserScrollingUp}
        scrollChatToBottom={scrollChatToBottom}
      />
    </div>
  );
};

export default Chat;
