import { FC } from "react";
import { USER_STATUS } from "../../../../types/PublicTypes";

interface Props {
  userName: string;
  avatar: string;
  status?: USER_STATUS;
}

const Avatar: FC<Props> = ({ userName, avatar, status }) => {
  const handleGetLogo = () => {
    const words = userName.split(" ");
    const capitalizeFirstLetter = (word: string) =>
      word.charAt(0).toUpperCase();

    if (words.length >= 2) {
      return words.map(capitalizeFirstLetter).join("").slice(0, 2);
    }

    return capitalizeFirstLetter(userName);
  };

  const handleGetStatusColor = () => {
    const ONLINE_COLOR = "bg-green-400";
    const OFFLINE_COLOR = "bg-slate-400";

    switch (status) {
      case USER_STATUS.ONLINE: {
        return ONLINE_COLOR;
      }
      case USER_STATUS.OFFLINE: {
        return OFFLINE_COLOR;
      }
      default: {
        return OFFLINE_COLOR;
      }
    }
  };

  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-center font-semibold`}
      style={{ backgroundColor: avatar || "transparent" }}
    >
      {handleGetLogo()}
      {status && (
        <div
          className={`${handleGetStatusColor()} absolute bottom-0 right-0 h-3 w-3 rounded-lg border-2 border-white`}
        />
      )}
    </div>
  );
};

// add avatar to message document

export default Avatar;
