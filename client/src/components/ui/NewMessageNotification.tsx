import { FC } from "react";
import { ArrowDown } from "react-bootstrap-icons";

interface Props {
  scrollChatToBottom: (smooth?: boolean) => void;
  isNewMessagesVisible: boolean;
}

const NewMessageNotification: FC<Props> = ({
  scrollChatToBottom,
  isNewMessagesVisible,
}) => {
  return (
    <div
      className={`absolute transition-opacity ${
        isNewMessagesVisible ? "opacity-1 block" : "none opacity-0"
      } bottom-14 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center gap-3 rounded-lg border-2 border-slate-600 bg-slate-900 p-3`}
      onClick={() => scrollChatToBottom(true)}
    >
      <p>New messages</p>
      <ArrowDown />
    </div>
  );
};

export default NewMessageNotification;
