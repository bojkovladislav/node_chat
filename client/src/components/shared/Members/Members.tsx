import { FC, useEffect, useState, memo } from "react";
import { getGroupMembers } from "../../../adapters/api";
import { AvatarWithName } from "../../shared/AvatarWithName";
import { ID, SetState, USER_STATUS } from "../../../../types/PublicTypes";
import { PrivateRoom, PrivateRooms } from "../../../../types/Rooms";

interface Props {
  memberIds: ID[];
  openRoomUserModal: () => void;
  closeMainModal: () => void;
  setSelectedMember: SetState<PrivateRoom | null>;
}

const skeletonMembers: PrivateRooms = [
  {
    name: "Bohdan",
    id: "7da96f90-457d-4bbf-8c0d-1072b5d114c5" as ID,
    avatar: "#F87171",
    status: USER_STATUS.ONLINE,
    creators: ["7da96f90-457d-4bbf-8c0d-1072b5d114c5"],
    commonId: "7da96f90-457d-4bbf-8c0d-1072asdasdasd",
    description: "asdasd",
    opponentRoomId: "ab1f3c44-9c9d-4930-a9f8-18e5bbfb296b",
  },
  {
    name: "Alice",
    id: "ab1f3c44-9c9d-4930-a9f8-18e5bbfb296b" as ID,
    avatar: "#7C3AED",
    status: USER_STATUS.ONLINE,
    creators: ["ab1f3c44-9c9d-4930-a9f8-18e5bbfb296b"],
    commonId: "7da96f90-457d-4bbf-8c0d-1072asdasdasd",
    opponentRoomId: "7da96f90-457d-4bbf-8c0d-1072b5d114c5",
    description: "asdasas",
  },
];

const Members: FC<Props> = ({
  memberIds,
  openRoomUserModal,
  closeMainModal,
  setSelectedMember,
}) => {
  const [members, setMembers] = useState<PrivateRooms>(skeletonMembers);
  const [loading, setLoading] = useState(true);

  const handleFetchMembers = async () => {
    try {
      setLoading(true);
      const membersFromServer = await getGroupMembers(memberIds);

      setMembers(membersFromServer.data.groupMembers);
    } catch (error) {
      setMembers(null);
      console.log(error);
      throw Error("Failed to fetch members!");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (member: PrivateRoom) => {
    if (loading) return;

    openRoomUserModal();
    closeMainModal();
    setSelectedMember(member);
  };

  useEffect(() => {
    handleFetchMembers();
  }, [memberIds]);

  return (
    <div className="flex flex-col">
      {members?.map((member) => (
        <div
          className="w-full cursor-pointer p-2 transition-all duration-300 hover:bg-slate-700"
          key={member.id}
          onClick={() => handleMemberClick(member)}
        >
          <AvatarWithName
            avatar={member.avatar}
            name={member.name}
            loadingState={loading}
            additionalInfo={member.status}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(Members);
