import { FC } from "react";
import { Message as MessageType } from "../../../types/Messages";
import { Skeleton } from "@mantine/core";
import { Group, RoomType } from "../../../types/Rooms";
import { Clock } from "react-bootstrap-icons";
import { ID } from "../../../types/PublicTypes";
import Avatar from "./Avatar";

interface Props {
  messages: MessageType[];
  message: MessageType;
  index: number;
  userId: ID;
  room: RoomType;
  isMessagesLoading: boolean;
  sentMessageId: ID | null;
}

const Message: FC<Props> = ({
  messages,
  index,
  userId,
  message,
  room,
  isMessagesLoading,
  sentMessageId,
}) => {
  const { authorName, authorId, content, date, id, avatar } = message;
  const isMyMessage = authorId === userId;
  const isNextMessageMine = messages[index + 1]?.authorId === userId;
  const gapClass = isMyMessage ? "mb-1" : isNextMessageMine ? "mb-1" : "mb-5";

  return (
    <div
      className={`flex w-fit max-w-full flex-col gap-1 md:max-w-md ${gapClass} ${
        index === messages.length - 1 ? "mb-0" : ""
      } ${isMyMessage ? "self-end" : "self-start"}`}
    >
      <div className="flex items-center gap-2">
        {userId !== authorId && (room as Group).members && (
          <Skeleton visible={isMessagesLoading} circle className="h-fit w-fit">
            <Avatar userName={authorName} avatar={avatar} />
          </Skeleton>
        )}
        <div className="flex flex-col gap-1">
          <Skeleton visible={isMessagesLoading}>
            {(room as Group).members ? (
              <div className="flex items-end justify-end gap-2">
                <div
                  className={`flex flex-col gap-2 break-words rounded-lg border-2 border-transparent p-2 text-sm md:max-w-md ${
                    authorId === userId ? "bg-blue-500" : "bg-slate-800"
                  }`}
                >
                  {userId !== authorId && <p className="text-sm">{authorName}</p>}
                  <pre className="whitespace-pre-line">{content}</pre>
                </div>
              </div>
            ) : (
              <pre
                className={`flex whitespace-pre-line break-words rounded-lg border-2 border-transparent p-2 text-sm md:max-w-md ${
                  authorId === userId ? "bg-blue-500" : "bg-slate-800"
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
      </div>
    </div>
  );
};

export default Message;
