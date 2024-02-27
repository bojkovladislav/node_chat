import { useEffect, useRef, useState, memo } from "react";
import { MessageField } from "../MessageField";
import { SendMessageForm } from "../../forms/SendMessageForm";
import { useMediaQuery } from "@mantine/hooks";
import { User } from "../../../../types/Users";
import { Messages, OperatedMessage } from "../../../../types/Messages";
import { ID, SetState } from "../../../../types/PublicTypes";
import { Group, RoomType, RoomsType } from "../../../../types/Rooms";
import { ArrowLeft } from "react-bootstrap-icons";
import { NewMessageNotification } from "../NewMessageNotification";
import { ScrollToBottomArrow } from "../../shared/ScrollToBottomArrow";
import { socket } from "../../../adapters/socket";
import { Modal } from "../../shared/Modal";
import useDisclosureStore from "../../../store/useGroupDisclosureStore";
import { DeleteGroupForm } from "../../forms/DeleteRoomForm";
import { GroupSettingsMenu } from "../GroupSettingsMenu";

interface Props {
  messages: Messages | null;
  setMessages: SetState<Messages | null>;
  isMessagesLoading: boolean;
  user: User;
  room: RoomType | null;
  setRoom: SetState<RoomType | null>;
  setRooms: SetState<RoomsType>;
  filteredChats: RoomsType | null;
  setFilteredChats: SetState<RoomsType | null>;
}

const Chat = memo<Props>(
  ({
    user,
    room,
    setMessages,
    messages,
    setRoom,
    isMessagesLoading,
    setRooms,
    filteredChats,
    setFilteredChats,
  }) => {
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const [sentMessageId, setSentMessageId] = useState<ID | null>(null);
    const matches = useMediaQuery("(max-width: 765px)");
    const [newMessageFromOpponentId, setNewMessageFromOpponentId] =
      useState<ID | null>(null);
    const [isNewMessagesVisible, setIsNewMessagesVisible] = useState(false);
    const [isUserScrollingUp, setIsUserScrollingUp] = useState(false);
    const [currentTypingUserName, setCurrentTypingUserName] = useState<
      string | null
    >(null);
    const [operatedMessage, setOperatedMessage] = useState<OperatedMessage>({
      message: null,
      edited: false,
      replied: false,
    });
    const isUserNearBottom = useRef<boolean>(false);
    const isOverflowTriggered = useRef<boolean>(false);

    const {
      isOpened: isDeleteGroupModalOpened,
      closeDiscloSure: closeDeleteGroupModal,
    } = useDisclosureStore().deleteGroupItem;

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

    useEffect(() => {
      socket.on("send_updated_group_members", (userId: ID) => {
        setRoom((prevRoom) => {
          if (!prevRoom) return prevRoom;

          if ("members" in prevRoom) {
            const updatedRoom: Group = {
              ...prevRoom,
              members: [...prevRoom.members, userId],
            };

            return updatedRoom;
          }

          return prevRoom;
        });
      });

      return () => {
        socket.off("send_updated_group_members");
      };
    }, []);

    return (
      <div
        className={`relative flex h-full w-full flex-col ${
          !room && "flex items-center justify-center"
        } overflow-y-hidden border-slate-700 `}
      >
        {room ? (
          <>
            <div className="flex items-center justify-between border-b-2 border-slate-700 bg-slate-900 p-3">
              {/* header of the chat */}
              <div className="flex items-center gap-3">
                {matches && (
                  <ArrowLeft
                    onClick={() => {
                      setRoom(null);
                      setMessages(null);
                    }}
                  />
                )}
                <div className="flex-column gap-5">
                  <h1 className="text-lg">{room?.name}</h1>
                  <p
                    className={`text-xxs ${
                      currentTypingUserName ? "text-blue-500" : "text-slate-500"
                    }`}
                  >
                    {currentTypingUserName
                      ? `${currentTypingUserName} is typing...`
                      : (room as Group)?.members
                        ? `${(room as Group)?.members.length} member${
                            (room as Group)?.members.length > 1 ? "s" : ""
                          }`
                        : user.status}
                  </p>
                </div>
              </div>

              {/* here goes settings */}
              <GroupSettingsMenu />
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
                setCurrentTypingUserName={setCurrentTypingUserName}
                setOperatedMessage={setOperatedMessage}
              />
            </div>

            <SendMessageForm
              setSentMessageId={setSentMessageId}
              operatedMessage={operatedMessage}
              setOperatedMessage={setOperatedMessage}
              user={user}
              room={room}
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

        <Modal
          title="Delete Chat"
          close={closeDeleteGroupModal}
          opened={isDeleteGroupModalOpened}
        >
          <DeleteGroupForm
            title={room?.name || ""}
            setRooms={setRooms}
            roomType={room && (room as Group).members ? "group" : "private-room"}
            user={user}
            filteredChats={filteredChats}
            setFilteredChats={setFilteredChats}
            currentRoom={room}
            closeModal={closeDeleteGroupModal}
            setRoom={setRoom}
          />
        </Modal>
      </div>
    );
  },
);

export default Chat;
