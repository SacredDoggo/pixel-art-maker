import { create } from "zustand";

type ColourToolStore = {
    currentColour: string;
    currentTool: "pen" | "bucket" | "eraser";
    setCurrentColour: (colour: string) => void;
    setCurrentTool: (tool: "pen" | "bucket" | "eraser") => void;
  };
  
  export const useColourToolStore = create<ColourToolStore>((set) => ({
    currentColour: "#000000",
    currentTool: "pen",
    setCurrentColour: (colour) => set({ currentColour: colour }),
    setCurrentTool: (tool) => set({ currentTool: tool })
  }));