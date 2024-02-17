import { useEffect } from "react";
import { socket } from "../adapters/socket";

const useSocketCleanup = (events: string[]) => {
  useEffect(() => {
    const cleanup = () => {
      events.forEach((event) => {
        socket.off(event);
      });
    };

    return cleanup;
  }, []);
};

export default useSocketCleanup;
