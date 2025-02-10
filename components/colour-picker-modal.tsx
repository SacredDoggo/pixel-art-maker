"use client";

import { useEffect } from "react";
import { ColorResult, PhotoshopPicker } from "react-color";

import { useColourPickerStore } from "@/store/colour-picker-store";
import { useColourToolStore } from "@/store/colour-tool-store";

export const ColourPickerModal = () => {
    const cps = useColourPickerStore();
    const cts = useColourToolStore();

    // Close the color picker
    const handleClose = () => {
        cps.setLastColourState(cts.currentColour);
        cps.closeColourPickerModal();
    };

    // Handle color change
    const handleChange = (newColor: ColorResult) => {
        cps.setLastColourState(newColor.hex);
    };

    // Handle when the user accepts the color
    const handleAccept = () => {
        cts.setCurrentColour(cps.lastColourState);
        cps.closeColourPickerModal();
        // Add your logic here (e.g., save the color to state or API)
    };

    // Handle when the user cancels the color selection
    const handleCancel = () => {
        handleClose();
    };

    return (
        <>
            {cps.isColourPickerModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
                    <div className="relative z-50 bg-white dark:bg-gray-800 text-black p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <PhotoshopPicker
                            color={cps.lastColourState}
                            onAccept={handleAccept}
                            onCancel={handleCancel}
                            onChange={handleChange}
                            header="Choose Color"
                        />
                    </div>
                </div>
            )}
        </>
    );
}