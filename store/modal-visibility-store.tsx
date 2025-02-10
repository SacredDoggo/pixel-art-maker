import { create } from "zustand";

type ColourToolStore = {
    isColourPickerModalOpen: boolean;
    openColourPickerModal: () => void;
    closeColourPickerModal: () => void;
    toggleColourPickerModal: () => void;
  };
  
  export const useModalVisibilityStore = create<ColourToolStore>((set, get) => ({
    isColourPickerModalOpen: false,
    openColourPickerModal: () => { set({ isColourPickerModalOpen: true }) },
    closeColourPickerModal: () => { set({ isColourPickerModalOpen: false }) },
    toggleColourPickerModal: () => { set({ isColourPickerModalOpen: !get().isColourPickerModalOpen }) }
  }));