"use client";

import { useModalVisibilityStore } from "@/store/modal-visibility-store";
import { useState } from "react";

interface CurrentColourAndColourSelectorProps {
    colour: string;
}

export const CurrentColourAndColourSelector = ({
    colour
}: CurrentColourAndColourSelectorProps) => {
    const mvs = useModalVisibilityStore();

    return (
        <div className="w-full h-10 p-2 flex items-center bg-[#3f3f3f] rounded-md relative">
            <span className="font-medium font-mono ">{colour}</span>
            <div
                className="h-6 flex-1 ml-2 cursor-pointer rounded-md border-2"
                style={{ backgroundColor: colour }}
                role="button"
                onClick={mvs.openColourPickerModal}
            />
        </div>
    );
}