import { FC, FormEvent, useEffect, useRef } from "react";
import { SetState } from "../../../../types/PublicTypes";

interface Props {
  isCreateNewChatTriggered: boolean;
  handleOpenRoomCreation: () => void;
  handleRoomAdd: (
    event: FormEvent,
    roomName: string,
    isPublic: boolean,
  ) => void;
  roomName: string;
  isPublic: boolean;
  setIsCreateNewChatTriggered: SetState<boolean>;
  setIsPublic: SetState<boolean>;
  handleInputChange: (value: string) => void;
  inputError: string;
  areRoomsLoading: boolean;
  leftBarCurrentWidth?: number;
}

const AddNewChat: FC<Props> = ({
  isCreateNewChatTriggered,
  handleOpenRoomCreation,
  handleRoomAdd,
  roomName,
  isPublic,
  setIsCreateNewChatTriggered,
  setIsPublic,
  handleInputChange,
  leftBarCurrentWidth,
  inputError,
  areRoomsLoading,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && isCreateNewChatTriggered) {
      inputRef.current.focus();
    }
  }, [isCreateNewChatTriggered]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">Chats</h1>
      {!isCreateNewChatTriggered ? (
        <button
          className="button bg-blue-500"
          onClick={handleOpenRoomCreation}
          disabled={areRoomsLoading}
        >
          New chat +
        </button>
      ) : (
        <div>
          <form
            className="flex flex-col gap-10"
            onSubmit={(e) => handleRoomAdd(e, roomName, isPublic || false)}
          >
            <div className="relative">
              <input
                className={`relative w-full rounded-sm bg-slate-700 p-2 outline-none ${
                  inputError && "text-red-500"
                }`}
                ref={inputRef}
                type="text"
                placeholder="Enter the name of chat"
                value={roomName}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {inputError && (
                <p className="absolute top-11 text-sm font-semibold text-red-600">
                  {inputError}
                </p>
              )}
            </div>
            <div className="flex gap-2 self-start">
              <label htmlFor="isPublic" className="text-sm">
                Public:
              </label>
              <input
                type="checkbox"
                name="isPublic"
                id="isPublic"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
            </div>
            <div
              className={`flex w-full justify-between ${
                leftBarCurrentWidth &&
                leftBarCurrentWidth <= 370 &&
                "flex-col gap-3"
              }`}
            >
              <button className="button bg-blue-500">Done</button>
              <button
                className="button bg-red-500"
                onClick={() => setIsCreateNewChatTriggered(false)}
              >
                Dismiss
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNewChat;
