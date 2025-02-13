"use client";

import { ColourPickerModal } from "@/components/colour-picker-modal";
import { NewProjectModal } from "@/components/new-project-modal";
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
        </>
    );
}