import { create } from "zustand";

type ExportStore = {
    isExportModalOpen: boolean;
    openExportModal: () => void;
    closeExportModal: () => void;
};

export const useExportStore = create<ExportStore>((set) => ({
    isExportModalOpen: true,
    openExportModal: () => { set({ isExportModalOpen: true }) },
    closeExportModal: () => { set({ isExportModalOpen: false }) }
}));