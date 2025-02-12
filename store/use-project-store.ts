import { create } from "zustand";

type ProjectStore = {
    currentProject: Project | null;
    setCurrentProject: (project: Project) => void;

    resetProjectStore: () => void;
  };
  
  export const useProjectStore = create<ProjectStore>((set) => ({
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),
    
    resetProjectStore: () => set({ currentProject: null })
  }));