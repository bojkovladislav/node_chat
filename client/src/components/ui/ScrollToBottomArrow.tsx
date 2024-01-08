import { FC } from "react";
import { ChevronDown } from "react-bootstrap-icons";

interface Props {
  isUserScrollingUp: boolean;
  scrollChatToBottom: (smooth?: boolean) => void;
}

const ScrollToBottomArrow: FC<Props> = ({
  isUserScrollingUp,
  scrollChatToBottom,
}) => {
  return (
    <div
      className={`absolute transition-opacity ${
        isUserScrollingUp ? "opacity-1 block" : "none opacity-0"
      } bottom-20 right-10 cursor-pointer items-center gap-3 rounded-full border-2 border-slate-600 bg-slate-900 p-3`}
      onClick={() => scrollChatToBottom(true)}
    >
      <ChevronDown />
    </div>
  );
};

export default ScrollToBottomArrow;
