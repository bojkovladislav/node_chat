import { FC, FormEvent, useState, useRef, useEffect } from "react";
import { EmojiSmile, Send } from "react-bootstrap-icons";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { socket } from "../socket";
import { User } from "../../types/Users";
import { ID, SetState } from "../../types/PublicTypes";
import { Message, Messages } from "../../types/Messages";
import useSocketCleanup from "../hooks/useSocketCleanup";

interface Props {
  setSentMessageId: SetState<ID | null>;
  isMessagesLoading: boolean;
  user: User;
  roomId: ID;
  setMessages: SetState<Messages>;
}

const SendMessageForm: FC<Props> = ({
  user,
  roomId,
  setMessages,
  setSentMessageId,
  isMessagesLoading,
}) => {
  const [isEmojiClicked, setIsEmojiClicked] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useSocketCleanup(["message_created", "send_message", "create_message"]);

  const getDate = () => {
    const currentDate = new Date(Date.now());

    const padZero = (value: number) => (value < 10 ? `0${value}` : `${value}`);

    const hours = padZero(currentDate.getHours());
    const minutes = padZero(currentDate.getMinutes());

    return `${hours}:${minutes}`;
  };

  const handleSetMessage = (newMessage: Message) => {
    setSentMessageId(newMessage.id);

    setMessages((prevMessages) => {
      if (!prevMessages) return prevMessages;

      return {
        ...prevMessages,
        messages: [...prevMessages.messages, newMessage],
      };
    });

    updateTextareaHeight();
  };

  const handleSendMessage = (e: FormEvent | KeyboardEvent) => {
    e.preventDefault();

    if (message === "") return;

    socket.emit("create_message", roomId, user.name, message, getDate());

    setMessage("");
  };

  const updateTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "32px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  };

  useEffect(() => {
    socket.on("send_message", (message: any) => {
      console.log("it happened!"), handleSetMessage(message);
    });
    socket.on("message_created", () => setSentMessageId(null));
  }, []);

  return (
    <form
      className="sticky bottom-0 flex w-full items-center gap-5 border-t border-slate-600 bg-slate-900 px-5 py-3"
      onSubmit={handleSendMessage}
    >
      <EmojiSmile
        color="#3b82f6"
        size={20}
        cursor="pointer"
        onClick={() => setIsEmojiClicked(!isEmojiClicked)}
      />
      {isEmojiClicked && (
        <div className="absolute bottom-full">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(emoji) =>
              setMessage((prevMessage) => `${prevMessage}${emoji.emoji}`)
            }
          />
        </div>
      )}
      <textarea
        className="h-8 w-full resize-none rounded-md border-transparent bg-slate-700 p-1 text-sm outline-none"
        placeholder="Write a message..."
        ref={textareaRef}
        value={message}
        disabled={isMessagesLoading}
        onChange={(e) => {
          setMessage(e.target.value);
          updateTextareaHeight();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) handleSendMessage(e);
        }}
      />
      <button type="submit">
        <Send color="#3b82f6" size={20} cursor="pointer" />
      </button>
    </form>
  );
};
export default SendMessageForm;
