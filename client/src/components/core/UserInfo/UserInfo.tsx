import { FC } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { User } from "../../../../types/Users";
import { AvatarWithName } from "../../shared/AvatarWithName";

interface Props {
  user: User | null;
}

const UserInfo: FC<Props> = ({ user }) => {
  const matches = useMediaQuery("(max-width: 765px)");

  return (
    <div
      className="flex min-w-[300px] flex-col gap-5"
      style={{ maxWidth: matches ? "300px" : "400px" }}
    >
      <div className="px-3">
        {user && (
          <AvatarWithName
            avatar={user.avatar}
            avatarSize={60}
            name={user.name}
            additionalInfo={user.status}
          />
        )}
      </div>

      <button className="bg-slate-800 p-3 text-blue-500 transition-all duration-300 hover:bg-slate-700">
        Send direct message
      </button>
    </div>
  );
};

export default UserInfo;
