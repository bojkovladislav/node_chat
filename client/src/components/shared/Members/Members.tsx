import { FC, useEffect, useState, memo } from "react";
import { User, Users } from "../../../../types/Users";
import { getGroupMembers } from "../../../adapters/api";
import { AvatarWithName } from "../../shared/AvatarWithName";
import { ID, SetState, USER_STATUS } from "../../../../types/PublicTypes";

interface Props {
  memberIds: ID[];
  openRoomUserModal: () => void;
  closeMainModal: () => void;
  setSelectedMember: SetState<User | null>;
}

const skeletonMembers = [
  {
    name: "Bohdan",
    id: "7da96f90-457d-4bbf-8c0d-1072b5d114c5" as ID,
    avatar: "#F87171",
    rooms: ["9330540d-d355-4393-a47c-8649d9ec81d9"] as ID[],
    socketId: "SfL0Cny0HI_JNjFCAAAr",
    status: USER_STATUS.ONLINE,
  },
  {
    name: "Alice",
    id: "ab1f3c44-9c9d-4930-a9f8-18e5bbfb296b" as ID,
    avatar: "#7C3AED",
    rooms: [
      "9330540d-d355-4393-a47c-8649d9ec81d9",
      "a8a9d026-1d95-46db-b044-6ad35e3a72c0",
    ] as ID[],
    socketId: "rfL0Cny0HI_JNjFCBCDf",
    status: USER_STATUS.ONLINE,
  },
];

const Members: FC<Props> = ({
  memberIds,
  openRoomUserModal,
  closeMainModal,
  setSelectedMember,
}) => {
  const [members, setMembers] = useState<Users>(skeletonMembers);
  const [loading, setLoading] = useState(true);

  const handleFetchMembers = async () => {
    try {
      setLoading(true);
      const membersFromServer = await getGroupMembers(memberIds);

      setMembers(membersFromServer.data.groupMembers);
    } catch (error) {
      console.log(error);
      throw Error("Failed to fetch members!");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (member: User) => {
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
