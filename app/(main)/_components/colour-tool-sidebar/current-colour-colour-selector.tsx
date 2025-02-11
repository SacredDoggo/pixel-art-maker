"use client";

import { useColourPickerStore } from "@/store/colour-picker-store";

interface CurrentColourAndColourSelectorProps {
    colour: string;
}

export const CurrentColourAndColourSelector = ({
    colour
}: CurrentColourAndColourSelectorProps) => {
    const cps = useColourPickerStore();

    return (
        <div className="w-full h-10 p-2 flex items-center bg-[#333333] rounded-md relative">
            <span className="font-medium font-mono ">{colour}</span>
            <div
                className="h-6 flex-1 ml-2 cursor-pointer rounded-md border-2"
                style={{ backgroundColor: colour }}
                role="button"
                onClick={cps.openColourPickerModal}
            />
        </div>
    );
}