"use client";

import { ColourPalette, deleteColour, editColourPalette } from "@/db/tauri-sqlite-db";
import { ColourBox } from "./colour-box";
import { useColourToolStore } from "@/store/colour-tool-store";
import { Dispatch, SetStateAction, useState } from "react";
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
import { useColourPickerStore } from "@/store/colour-picker-store";
import { useDatabase } from "@/hooks/use-database";

interface ColourBoxContainerProps {
    handleColourPaletteChange: Dispatch<SetStateAction<ColourPalette[]>>;
    colourPalette: ColourPalette[];
}

export const ColourBoxContainer = ({
    handleColourPaletteChange,
    colourPalette
}: ColourBoxContainerProps) => {
    const cts = useColourToolStore();
    const db = useDatabase();

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

    // Callback for handleEdit
    const editCallback = () => {
        const { newColour, editColourId } = useColourPickerStore.getState();
        if (!editColourId || !newColour) return;
        editColourPalette(db, editColourId, newColour).then((data) => {
            if (data) handleColourPaletteChange(data);
        });
    };

    // Handle edit
    const handleEditClick = () => {
        if (!selectedColour || !selectedId) return;

        // Update Zustand store with selected values
        useColourPickerStore.getState().setLastColourState(selectedColour);
        useColourPickerStore.getState().setMode("editing");
        useColourPickerStore.getState().setEditColour(selectedColour);
        useColourPickerStore.getState().setEditColourId(selectedId);
        useColourPickerStore.getState().setLabel("Editing: " + selectedColour);

        // Set the callback (now uses fresh state via `getState()`)
        useColourPickerStore.getState().setHandleEdit(editCallback);
        useColourPickerStore.getState().openColourPickerModal();
    }

    // Handle delete
    const handleDeleteClick = () => {
        if (!selectedId) return;
        deleteColour(db, selectedId).then((data) => { if (data) handleColourPaletteChange(data); });
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
            {selectedColour && selectedId && <ContextMenuPortal>
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
                        onClick={handleEditClick}
                        className="cursor-pointer flex items-center text-sm hover:bg-[#474747] p-1 rounded-sm"
                    >
                        <FilePenLineIcon className="h-4 w-4 mr-1" /> Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={handleDeleteClick}
                        className="cursor-pointer flex items-center text-sm hover:bg-[#474747] p-1 rounded-sm"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" /> Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenuPortal>}
        </ContextMenu>
    );
}