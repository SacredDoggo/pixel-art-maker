import { create } from "zustand";

type ProjectStore = {
    currentProject: Project | null;
    setCurrentProject: (project: Project) => void;

    isNewProjectModalOpen: boolean;
    openNewProjectModalOpen: () => void;
    closeNewProjectModalOpen: () => void;

    resetProjectStore: () => void;
  };
  
  export const useProjectStore = create<ProjectStore>((set) => ({
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),

    isNewProjectModalOpen: true,
    openNewProjectModalOpen: () => { set({ isNewProjectModalOpen: true }) },
    closeNewProjectModalOpen: () => { set({ isNewProjectModalOpen: false }) },
    
    resetProjectStore: () => set({ currentProject: null })
  }));