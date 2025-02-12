import { create } from "zustand";

type ColourPickerStore = {
  label: string;
  setLabel: (label: string) => void;

  mode: "editing" | "current";
  setMode: (mode: "editing" | "current") => void;

  editColourId: number | null;
  setEditColourId: (editColourId: number) => void;
  editColour: string | null;
  setEditColour: (editColour: string) => void;
  newColour: string | null;
  setNewColour: (newColour: string) => void;

  handleEdit: (() => void) | null;
  setHandleEdit: (callback: () => void) => void;

  lastColourState: string;
  setLastColourState: (colour: string) => void;

  isColourPickerModalOpen: boolean;
  openColourPickerModal: () => void;
  closeColourPickerModal: () => void;
  toggleColourPickerModal: () => void;

  resetColourPicker: () => void;
};

export const useColourPickerStore = create<ColourPickerStore>((set, get) => ({
  label: "Choose a colour",
  setLabel: (label) => { set({ label: label }) },

  mode: "current",
  setMode: (mode: "editing" | "current") => { set({ mode: mode }) },

  editColourId: null,
  setEditColourId: (editColourId) => { set({ editColourId: editColourId }) },
  editColour: null,
  setEditColour: (editColour) => { set({ editColour: editColour }) },
  newColour: null,
  setNewColour: (newColour) => { set({ newColour: newColour }) },

  handleEdit: null,
  setHandleEdit: (callback) => { set({ handleEdit: callback }) },

  lastColourState: "#000000",
  setLastColourState: (colour) => { set({ lastColourState: colour }) },

  isColourPickerModalOpen: false,
  openColourPickerModal: () => { set({ isColourPickerModalOpen: true }) },
  closeColourPickerModal: () => { set({ isColourPickerModalOpen: false }) },
  toggleColourPickerModal: () => { set({ isColourPickerModalOpen: !get().isColourPickerModalOpen }) },

  resetColourPicker: () => {
    set({
      newColour: null,
      editColour: null,
      editColourId: null,
      mode: "current",
      label: "Choose a colour",
      handleEdit: null
    });
  }
}));