import { Skeleton } from "@mantine/core";
import { FC } from "react";
import { People } from "react-bootstrap-icons";

interface Props {
  loading: boolean;
  name: string;
  isRoomsLoading: boolean;
}

const Group: FC<Props> = ({ loading, name, isRoomsLoading }) => {
  return (
    <Skeleton
      visible={isRoomsLoading}
      id="skeleton-light"
      className="flex items-center gap-2"
    >
      <People />
      <p>{loading ? "Creating a group..." : name}</p>
    </Skeleton>
  );
};

export default Group;
