import { FC, useEffect, useMemo } from "react";
import { Message as MessageType, Messages } from "../../types/Messages";
import { User } from "../../types/Users";
import { socket } from "../socket";
import { ID, SetState } from "../../types/PublicTypes";
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

  useEffect(() => {
    socket.on("receive_message", (roomId, newMessage) => {
      console.log("this log is inside socket");
      handleReceiveMessage(roomId, newMessage);
    });

    return () => {
      socket.off("receive_message");
      socket.off("get_messages");
      socket.off("messages_got");
      socket.off("message_created");
    };
  }, []);

  const messagesData: MessageType[] = useMemo(
    () =>
      isMessagesLoading
        ? (Array.from({ length: 5 }).map((_, i) => {
            return {
              id: uuid(),
              authorName: i % 2 !== 0 ? "Friend" : user.name,
              authorId: i % 2 !== 0 ? "123-123-123-123-123" : user.id,
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
            userId={user.id}
          />
        ))}
    </div>
  );
};

export default MessageField;
