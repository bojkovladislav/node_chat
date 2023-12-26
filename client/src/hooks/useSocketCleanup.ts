import { useEffect } from "react";
import { socket } from "../socket";

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
