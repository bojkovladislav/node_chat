import { FC, useMemo } from "react";
import { Group, PrivateRoom, RoomType } from "../../../../types/Rooms";
import { handlePlural } from "../../../helpers";
import { Members } from "../../shared/Members";
import { useMediaQuery } from "@mantine/hooks";
import { AvatarWithName } from "../../shared/AvatarWithName";
import { User } from "../../../../types/Users";
import { SetState } from "../../../../types/PublicTypes";

interface Props {
  currentRoom: RoomType;
  openRoomUserModal: () => void;
  closeRoomInfoModal: () => void;
  isUserModalOpened: boolean;
  setSelectedMember: SetState<User | null>;
}

const ViewRoomInfo: FC<Props> = ({
  currentRoom,
  openRoomUserModal,
  closeRoomInfoModal,
  setSelectedMember,
}) => {
  const { name, avatar, description } = currentRoom;
  const status = (currentRoom as PrivateRoom).status;
  const memberIds = (currentRoom as Group).members;
  const matches = useMediaQuery("(max-width: 765px)");
  const numMembersString =
    memberIds &&
    useMemo(
      () => `${memberIds.length} member${handlePlural(memberIds.length)}`,
      [memberIds],
    );

  return (
    <div
      className="flex min-w-[300px] flex-col gap-10"
      style={{ maxWidth: matches ? "300px" : "400px" }}
    >
      <div className="flex flex-col gap-2 px-3">
        <AvatarWithName
          avatarSize={60}
          avatar={avatar}
          name={name}
          additionalInfo={!memberIds ? status : numMembersString}
        />

        {description && (
          <div>
            <h3 className="text-md text-slate-300">Description</h3>
            <p className="text-sm">{description}</p>
          </div>
        )}
      </div>

      {memberIds && (
        <div className="flex flex-col gap-1">
          <h1 className="text-md px-3 uppercase text-white">
            {numMembersString}
          </h1>

          <Members
            closeMainModal={closeRoomInfoModal}
            memberIds={memberIds}
            openRoomUserModal={openRoomUserModal}
            setSelectedMember={setSelectedMember}
          />
        </div>
      )}
    </div>
  );
};

export default ViewRoomInfo;
