import { Avatar } from "../../shared/Avatar";
import { FC, ReactNode } from "react";
import { USER_STATUS } from "../../../../types/PublicTypes";
import { Skeleton } from "@mantine/core";

interface Props {
  name: string;
  avatar: string;
  status?: USER_STATUS;
  statusOfMember?: USER_STATUS;
  loadingState: boolean;
  children?: ReactNode;
  avatarSize?: number;
}

const AvatarWithName: FC<Props> = ({
  name,
  avatar,
  status,
  statusOfMember,
  loadingState,
  children,
  avatarSize,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton
        visible={loadingState}
        circle
        className={`h-fit w-fit min-w-[${avatarSize || "40px"}]`}
      >
        <Avatar
          name={name}
          avatar={avatar}
          status={status}
          avatarSize={avatarSize}
        />
      </Skeleton>

      <div>{children}</div>

      <Skeleton visible={loadingState}>
        <p>{name}</p>
        {statusOfMember && (
          <p className="text-sm text-slate-500">{statusOfMember}</p>
        )}
      </Skeleton>
    </div>
  );
};

export default AvatarWithName;
