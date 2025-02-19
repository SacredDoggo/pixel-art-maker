"use client";

import { ColourPickerModal } from "@/components/modals/colour-picker-modal";
import { ExportCanvasModal } from "@/components/modals/export-canvas-modal";
import { NewProjectModal } from "@/components/modals/new-project-modal";
import { OpenProjectModal } from "@/components/modals/open-project-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    });

    if (!mounted) return <></>;
    return (
        <>
            <ColourPickerModal />
            <NewProjectModal />
            <OpenProjectModal />
            <ExportCanvasModal />
        </>
    );
}