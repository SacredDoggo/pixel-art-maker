import { useModalVisibilityStore } from "@/store/modal-visibility-store";

export const ColourPickerModal = () => {
    const mvs = useModalVisibilityStore();
    return (
        <>
            {mvs.isColourPickerModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={mvs.closeColourPickerModal} />
                    <div className="relative z-50 w-64 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm">This dialog is now full-screen aware!</p>
                    </div>
                </div>
            )}
        </>
    );
}