import { FC, ReactNode } from "react";
import { Modal as ModelUI } from "@mantine/core";

interface Props {
  children: ReactNode;
  title: string;
  opened: boolean;
  close: () => void;
}

const Modal: FC<Props> = ({ children, title, close, opened }) => {
  return (
    <ModelUI opened={opened} onClose={close} title={title} centered>
      {children}
    </ModelUI>
  );
};

export default Modal;
