"use client";

import { ColourPalette } from "@/db/tauri-sqlite-db";
import { ColourBox } from "./colour-box";
import { useColourToolStore } from "@/store/colour-tool-store";
import { useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@radix-ui/react-context-menu";
import { FilePenLineIcon, TrashIcon } from "lucide-react";

interface ColourBoxContainerProps {
    colourPalette: ColourPalette[];
}

export const ColourBoxContainer = ({
    colourPalette
}: ColourBoxContainerProps) => {
    const cts = useColourToolStore();

    const [selectedColour, setSelectedColour] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Handle colour click using Event Delegation
    const handleColourBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest(".colour-box");
        if (!target) return;

        if (target.getAttribute("data-colour") != null) {
            const colour = target.getAttribute("data-colour");
            if (!colour) return;
            if (e.button == 0) cts.setCurrentColour(colour);
        }
    };

    // Handle contextMenu open
    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest(".colour-box");
        if (!target) return;

        if (target.getAttribute("data-colour") != null) {
            const colour = target.getAttribute("data-colour");
            setSelectedColour(colour);
        }

        if (target.getAttribute("data-colour-id") != null) {
            const colour_id = target.getAttribute("data-colour-id");
            if (colour_id) setSelectedId(parseInt(colour_id));
        }
    };

    const handleContextMenuClose = (open: boolean) => {
        if (open) return;
        setSelectedColour(null);
        setSelectedId(null);
    }

    return (
        <ContextMenu onOpenChange={handleContextMenuClose}>
            <ContextMenuTrigger asChild>
                <div
                    className="w-full bg-[#333333] h-[300px] p-2 overflow-auto colour-box-container rounded-md"
                    onClick={handleColourBoxClick}
                    onContextMenu={handleContextMenu}
                >
                    <span className="text-xs">Local</span>
                    <div className="flex flex-wrap gap-1 items-start">
                        {colourPalette?.map((colour) => (
                            <ColourBox
                                key={colour.id}
                                id={colour.id}
                                colour={colour.colour}
                            />
                        ))}
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuPortal>
                <ContextMenuContent
                    className="z-[51] bg-black p-1 space-y-2 rounded-md w-[150px]"
                >
                    <ContextMenuLabel asChild>
                        <div className="flex justify-center items-center gap-x-2 font-bold">
                            <span className="text-sm">{selectedColour ?? "null"}</span>
                            <ColourBox id={selectedId!} colour={selectedColour!} className="max-h-4 max-w-4 cursor-default border-0" />
                        </div>
                    </ContextMenuLabel>
                    <ContextMenuSeparator className="h-[1px] my-4 bg-white" />
                    <ContextMenuItem
                        className="cursor-pointer flex items-center text-sm hover:bg-[#474747] p-1 rounded-sm"
                    >
                        <FilePenLineIcon className="h-4 w-4 mr-1" /> Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                        className="cursor-pointer flex items-center text-sm hover:bg-[#474747] p-1 rounded-sm"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" /> Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenuPortal>
        </ContextMenu>
    );
}