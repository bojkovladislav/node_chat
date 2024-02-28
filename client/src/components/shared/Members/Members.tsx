import { FC, useEffect, useState } from "react";
import { Users } from "../../../../types/Users";
import { getGroupMembers } from "../../../adapters/api";
import { AvatarWithName } from "../../shared/AvatarWithName";
import { ID } from "../../../../types/PublicTypes";

interface Props {
  memberIds: ID[];
}

const Members: FC<Props> = ({ memberIds }) => {
  const [members, setMembers] = useState<Users>(null);
  const [loading, setLoading] = useState(true);

  const handleFetchMembers = async () => {
    try {
      setLoading(true);

      const membersFromServer = await getGroupMembers(memberIds);

      console.log(membersFromServer);

      setMembers(membersFromServer.data.groupMembers);
    } catch (error) {
      console.log(error);
      throw Error("Failed to fetch members!");
    } finally {
      setLoading(false);
    }
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
          onClick={() => console.log(member)}
        >
          <AvatarWithName
            avatar={member.avatar}
            name={member.name}
            loadingState={loading}
            statusOfMember={member.status}
          />
        </div>
      ))}
    </div>
  );
};

export default Members;
