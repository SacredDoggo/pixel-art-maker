import { create } from "zustand";

type ProjectStore = {
	currentProject: Project | null;
	setCurrentProject: (project: Project) => void;

	isOpenProjectModalOpen: boolean;
	openOpenProjectModal: () => void;
	closeOpenProjectModal: () => void;

	isNewProjectModalOpen: boolean;
	openNewProjectModal: () => void;
	closeNewProjectModal: () => void;

	resetProjectStore: () => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
	currentProject: null,
	setCurrentProject: (project) => set({ currentProject: project }),

	isOpenProjectModalOpen: true,
	openOpenProjectModal: () => { set({ isOpenProjectModalOpen: true }) },
	closeOpenProjectModal: () => { set({ isOpenProjectModalOpen: false }) },

	isNewProjectModalOpen: false,
	openNewProjectModal: () => { set({ isNewProjectModalOpen: true }) },
	closeNewProjectModal: () => { set({ isNewProjectModalOpen: false }) },

	resetProjectStore: () => set({ currentProject: null })
}));