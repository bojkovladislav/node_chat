import create, { StoreApi, UseBoundStore } from "zustand";

interface useDisclosure {
  isOpened: boolean;
  openDiscloSure: () => void;
  closeDiscloSure: () => void;
}

export type Item = "deleteGroupItem" | "groupInfoItem" | "manageGroupItem";

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
  deleteGroupItem: {
    isOpened: false,
    openDiscloSure: () => openModal(set, "deleteGroupItem"),
    closeDiscloSure: () => closeModal(set, "deleteGroupItem"),
  },
  groupInfoItem: {
    isOpened: false,
    openDiscloSure: () => openModal(set, "groupInfoItem"),
    closeDiscloSure: () => closeModal(set, "groupInfoItem"),
  },
  manageGroupItem: {
    isOpened: false,
    openDiscloSure: () => openModal(set, "manageGroupItem"),
    closeDiscloSure: () => closeModal(set, "manageGroupItem"),
  },
}));

export default useDisclosureStore;
