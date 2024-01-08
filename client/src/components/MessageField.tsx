import { FC, useEffect, useMemo } from "react";
import { Message as MessageType, Messages } from "../../types/Messages";
import { User } from "../../types/Users";
import { socket } from "../socket";
import { ID, SetState } from "../../types/PublicTypes";
import useSocketCleanup from "../hooks/useSocketCleanup";
import { v4 as uuid } from "uuid";
import { generateRandomLoremParagraph } from "../helpers/globalHelpers";
import { RoomType } from "../../types/Rooms";
import Message from "./ui/Message";
import "@mantine/core/styles.css";

interface Props {
  user: User;
  messages: Messages | null;
  sentMessageId: ID | null;
  isMessagesLoading: boolean;
  setMessages: SetState<Messages | null>;
  room: RoomType;
  setNewMessageFromOpponentId: SetState<null | ID>;
}

const MessageField: FC<Props> = ({
  user,
  messages,
  setMessages,
  isMessagesLoading,
  setNewMessageFromOpponentId,
  sentMessageId,
  room,
}) => {
  const handleReceiveMessage = (roomId: ID, newMessage: MessageType) => {
    setMessages((prevMessages) => {
      if (!prevMessages || prevMessages.roomId !== roomId) return prevMessages;

      setNewMessageFromOpponentId(newMessage.id);

      return {
        ...prevMessages,
        messages: [...prevMessages.messages, newMessage],
      };
    });
  };

  useSocketCleanup([
    "receive_message, get_messages, messages_got, message_created",
  ]);

  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);
  }, []);

  const messagesData: MessageType[] = useMemo(
    () =>
      isMessagesLoading
        ? (Array.from({ length: 5 }).map((_, i) => {
            return {
              id: uuid(),
              author: i % 2 !== 0 ? "Friend" : user.name,
              content: generateRandomLoremParagraph(),
              date: "13:37",
              avatar: "",
            };
          }) as MessageType[])
        : (messages?.messages as MessageType[]),
    [isMessagesLoading, messages],
  );

  return (
    <div className="flex flex-col p-5">
      {messagesData &&
        messagesData.map((message, index, arr) => (
          <Message
            key={message.id}
            room={room}
            message={message}
            messages={arr}
            index={index}
            isMessagesLoading={isMessagesLoading}
            sentMessageId={sentMessageId}
            userName={user.name}
          />
        ))}
    </div>
  );
};

export default MessageField;
