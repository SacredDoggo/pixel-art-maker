import { create } from "zustand";

type ColourPickerStore = {
  lastColourState: string;
  isColourPickerModalOpen: boolean;
  setLastColourState: (colour: string) => void;
  openColourPickerModal: () => void;
  closeColourPickerModal: () => void;
  toggleColourPickerModal: () => void;
};

export const useColourPickerStore = create<ColourPickerStore>((set, get) => ({
  lastColourState: "#000000",
  isColourPickerModalOpen: false,
  setLastColourState: (colour) => { set({ lastColourState: colour }) },
  openColourPickerModal: () => { set({ isColourPickerModalOpen: true }) },
  closeColourPickerModal: () => { set({ isColourPickerModalOpen: false }) },
  toggleColourPickerModal: () => { set({ isColourPickerModalOpen: !get().isColourPickerModalOpen }) }
}));