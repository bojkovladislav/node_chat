import { Skeleton } from "@mantine/core";
import { FC } from "react";
import { Robot } from "react-bootstrap-icons";

interface Props {
  name: string;
  isRoomsLoading: boolean;
  loading: boolean;
}

const PrivateRoom: FC<Props> = ({ name, isRoomsLoading, loading }) => {
  return (
    <Skeleton
      visible={isRoomsLoading}
      className="flex w-fit items-center gap-2"
    >
      <Robot />
      <p>{loading ? "Creating a room..." : name}</p>
    </Skeleton>
  );
};

export default PrivateRoom;
