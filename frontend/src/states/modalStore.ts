import {create} from "zustand";

interface ModalState {
  modalOpened: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  modalOpened: false,
  openModal: () => set({modalOpened: true}),
  closeModal: () => set({modalOpened: false}),
}));
