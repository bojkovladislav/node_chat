import { FC, ReactNode } from "react";
import { Modal as ModalUI } from "@mantine/core";

interface Props {
  children: ReactNode;
  title: string;
  opened: boolean;
  close: () => void;
}

const Modal: FC<Props> = ({ children, title, close, opened }) => {
  return (
    <ModalUI.Root opened={opened} onClose={close} centered size="auto">
      <ModalUI.Overlay
        backgroundOpacity={0.3}
        blur={3}
        transitionProps={{
          transition: "fade",
          duration: 300,
          timingFunction: "linear",
        }}
      />
      <ModalUI.Content>
        <ModalUI.Header className="bg-slate-800">
          <ModalUI.Title>{title}</ModalUI.Title>
          <ModalUI.CloseButton />
        </ModalUI.Header>
        <ModalUI.Body className="bg-[#0f172a] px-0 pt-3">
          {children}
        </ModalUI.Body>
      </ModalUI.Content>
    </ModalUI.Root>
  );
};

export default Modal;
