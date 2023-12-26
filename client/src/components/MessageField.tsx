import { FC, useEffect, useMemo } from "react";
import { Message, Messages } from "../../types/Messages";
import { User } from "../../types/Users";
import { socket } from "../socket";
import { ID, SetState } from "../../types/PublicTypes";
import useSocketCleanup from "../hooks/useSocketCleanup";
import { v4 as uuid } from "uuid";
import { generateRandomLoremParagraph } from "../helpers/globalHelpers";
import { Skeleton } from "@mantine/core";
import { Clock } from "react-bootstrap-icons";
import "@mantine/core/styles.css";
import { Group, RoomType } from "../../types/Rooms";

interface Props {
  user: User;
  messages: Messages;
  sentMessageId: ID | null;
  isMessagesLoading: boolean;
  setMessages: SetState<Messages>;
  room: RoomType;
}

const MessageField: FC<Props> = ({
  user,
  messages,
  setMessages,
  isMessagesLoading,
  sentMessageId,
  room,
}) => {
  const handleReceiveMessage = (roomId: ID, newMessage: Message) => {
    setMessages((prevMessages) => {
      if (!prevMessages || prevMessages.roomId !== roomId) return prevMessages;

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

  const messagesData = useMemo(
    () =>
      isMessagesLoading
        ? Array.from({ length: 6 }).map((_, i) => {
            return {
              id: uuid(),
              author: i % 2 !== 0 ? "Friend" : user.name,
              content: generateRandomLoremParagraph(),
              date: "13:37",
            };
          })
        : messages?.messages,
    [isMessagesLoading, messages],
  );

  return (
    <div className="flex flex-col p-5">
      {messagesData &&
        messagesData.map(({ id, author, content, date }, index, arr) => {
          const isMyMessage = author === user.name;
          const isNextMessageMine = arr[index + 1]?.author === user.name;
          const gapClass = isMyMessage
            ? "mb-1"
            : isNextMessageMine
              ? "mb-1"
              : "mb-5";

          return (
            <div
              key={id}
              className={`flex max-w-md flex-col gap-1 ${gapClass} ${
                index === arr.length - 1 ? "mb-0" : ""
              } ${isMyMessage ? "self-end" : "self-start"}`}
            >
              <Skeleton visible={isMessagesLoading}>
                {(room as Group).members ? (
                  <div
                    className={`flex max-w-md flex-col gap-2 break-words rounded-lg border-2 border-transparent p-2 text-sm ${
                      author === user.name ? "bg-blue-500" : "bg-slate-800"
                    }`}
                  >
                    {user.name !== author && (
                      <p className="text-sm">{author}</p>
                    )}
                    <pre className="whitespace-pre-line">{content}</pre>
                  </div>
                ) : (
                  <pre
                    className={`flex max-w-md whitespace-pre-line break-words rounded-lg border-2 border-transparent p-2 text-sm ${
                      author === user.name ? "bg-blue-500" : "bg-slate-800"
                    }`}
                  >
                    {content}
                  </pre>
                )}
              </Skeleton>
              <div className="flex w-full justify-between">
                <Skeleton className="w-fit" visible={isMessagesLoading}>
                  <p className="text-xxs text-slate-400">{date}</p>
                </Skeleton>
                {sentMessageId && sentMessageId === id && (
                  <Clock className="text-xs text-slate-400" />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MessageField;
