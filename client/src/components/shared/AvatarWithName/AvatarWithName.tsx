import { Avatar } from "../../shared/Avatar";
import { FC, ReactNode } from "react";
import { USER_STATUS } from "../../../../types/PublicTypes";
import { Skeleton } from "@mantine/core";

interface Props {
  name: string;
  avatar: string;
  status?: USER_STATUS;
  additionalInfo?: string;
  loadingState?: boolean;
  children?: ReactNode;
  avatarSize?: number;
}

const AvatarWithName: FC<Props> = ({
  name,
  avatar,
  status,
  additionalInfo,
  loadingState,
  children,
  avatarSize,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton
        visible={loadingState || false}
        circle
        className={`h-fit w-fit`}
        style={{ minWidth: `${avatarSize ? avatarSize : "40"}px` }}
      >
        <Avatar
          name={name}
          avatar={avatar}
          status={status}
          avatarSize={avatarSize}
        />
      </Skeleton>

      <div>{children}</div>

      <Skeleton visible={loadingState || false}>
        <p>{name}</p>
        {additionalInfo && (
          <p className="text-sm text-slate-500">{additionalInfo}</p>
        )}
      </Skeleton>
    </div>
  );
};

export default AvatarWithName;
