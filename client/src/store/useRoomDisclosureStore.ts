import create, { StoreApi, UseBoundStore } from "zustand";

interface useDisclosure {
  isOpened: boolean;
  openDiscloSure: () => void;
  closeDiscloSure: () => void;
}

export type Item = "deleteRoomItem" | "roomInfoItem" | "manageRoomItem";

type ItemsObj = Record<Item, useDisclosure>;

const openModal = (set: any, item: Item) => {
  return set((state: ItemsObj) => ({
    [item]: { ...state[item], isOpened: true },
  }));
};

const closeModal = (set: any, item: Item) => {
  return set((state: ItemsObj) => ({
    [item]: { ...state[item], isOpened: false },
  }));
};

const useDisclosureStore: UseBoundStore<StoreApi<ItemsObj>> = create((set) => ({
  deleteRoomItem: {
    isOpened: false,
    openDiscloSure: () => openModal(set, "deleteRoomItem"),
    closeDiscloSure: () => closeModal(set, "deleteRoomItem"),
  },
  roomInfoItem: {
    isOpened: false,
    openDiscloSure: () => openModal(set, "roomInfoItem"),
    closeDiscloSure: () => closeModal(set, "roomInfoItem"),
  },
  manageRoomItem: {
    isOpened: false,
    openDiscloSure: () => openModal(set, "manageRoomItem"),
    closeDiscloSure: () => closeModal(set, "manageRoomItem"),
  },
}));

export default useDisclosureStore;
