import { Skeleton } from "@mantine/core";
import { FC } from "react";
import { People } from "react-bootstrap-icons";
import Avatar from "./ui/Avatar";


interface Props {
  loading: boolean;
  name: string;
  isRoomsLoading: boolean;
  avatar: string;

}

const Group: FC<Props> = ({ loading, name, isRoomsLoading, avatar }) => {
  return (
    <Skeleton
      visible={isRoomsLoading}
      id="skeleton-light"
      className="flex items-center gap-2"
    >
      <Avatar avatar={avatar} userName={name} />
      <People />
      <p>{loading ? "Creating a group..." : name}</p>
    </Skeleton>
  );
};

export default Group;
