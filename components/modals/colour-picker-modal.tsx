"use client";

import { ColorResult, PhotoshopPicker } from "react-color";

import { useColourPickerStore } from "@/store/colour-picker-store";
import { useColourToolStore } from "@/store/colour-tool-store";

export const ColourPickerModal = () => {
    const cps = useColourPickerStore();
    const cts = useColourToolStore();

    // cps.setLastColourState(cps.editColour ?? "#00000000");

    // Close the color picker
    const handleClose = () => {
        cps.resetColourPicker();
        cps.setLastColourState(cts.currentColour);
        cps.closeColourPickerModal();
    };

    // Handle color change
    const handleChange = (newColor: ColorResult) => {
        cps.setLastColourState(newColor.hex);
        if (cps.mode == "editing") cps.setNewColour(newColor.hex);
    };

    // Handle when the user accepts the color
    const handleAccept = () => {
        if (cps.mode == "current") cts.setCurrentColour(cps.lastColourState.toUpperCase());
        else if (cps.mode == "editing") {            
            cps.handleEdit?.();
        }            
        handleClose();
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
                    <div className="relative z-50 bg-gray-800 text-black p-4 rounded-lg shadow-lg border border-gray-700">
                        <PhotoshopPicker
                            color={cps.lastColourState}
                            onAccept={handleAccept}
                            onCancel={handleCancel}
                            onChange={handleChange}
                            header={cps.label}
                        />
                    </div>
                </div>
            )}
        </>
    );
}