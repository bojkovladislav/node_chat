import { FC, useMemo } from "react";
import { Group, PrivateRoom, RoomType } from "../../../../types/Rooms";
import { handlePlural } from "../../../helpers";
import { Avatar } from "../../shared/Avatar";
import { Members } from "../../shared/Members";

interface Props {
  currentRoom: RoomType;
}

const ViewRoomInfo: FC<Props> = ({ currentRoom }) => {
  const { name, avatar, description } = currentRoom;
  const status = (currentRoom as PrivateRoom).status;
  const memberIds = (currentRoom as Group).members;
  const numMembersString =
    memberIds &&
    useMemo(
      () => `${memberIds.length} member${handlePlural(memberIds.length)}`,
      [memberIds],
    );

  return (
    <div className="flex min-w-[200px] max-w-[350px] flex-col gap-10">
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-5">
          <Avatar avatar={avatar} name={name} avatarSize={60} />
          <div>
            <h1 className="text-lg">{name}</h1>

            <p className="text-sm text-slate-500">
              {!memberIds ? status : numMembersString}
            </p>
          </div>
        </div>

        {description && (
          <div>
            <h3 className="text-md text-slate-300">Description</h3>
            <p className="text-sm">{description}</p>
          </div>
        )}
      </div>

      {memberIds && (
        <div className="flex flex-col gap-1">
          <h1 className="text-md px-2 uppercase text-white">
            {numMembersString}
          </h1>

          <Members memberIds={memberIds} />
        </div>
      )}
    </div>
  );
};

export default ViewRoomInfo;
