"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDatabase } from "@/hooks/use-database";
import { useColourToolStore } from "@/store/colour-tool-store"
import { ColourPalette, getColourPalette, insertColourPalette } from "@/db/tauri-sqlite-db";
import { ColourBoxContainer } from "./colour-box-container";
import { CurrentColourAndColourSelector } from "./current-colour-colour-selector";

export const ColourToolSidebar = () => {
    const cts = useColourToolStore();
    const db = useDatabase();

    const [colourPalette, setColourPalette] = useState<ColourPalette[]>([]);

    const loadColourPalette = async () => {
        getColourPalette(db).then((data) => { setColourPalette(data) });
    }

    useEffect(() => {
        loadColourPalette();
    }, [db, loadColourPalette]);

    const handleAddNewColourToPalette = async () => {
        insertColourPalette(db, cts.currentColour)
            .then((data) => { setColourPalette(data) });
    }

    return (
        <aside className="h-full w-[300px] p-1 overflow-auto space-y-1 bg-[#1f1f1f] z-50 relative">
            <CurrentColourAndColourSelector
                colour={cts.currentColour}
            />
            <div className="w-full">
                <Button
                    className="w-full h-6 bg-blue-500 rounded-md text-xs"
                    onClick={handleAddNewColourToPalette}
                >
                    Add to local palette
                </Button>
            </div>
            <ColourBoxContainer
                handleColourPaletteChange={setColourPalette}
                colourPalette={colourPalette}
            />
        </aside>
    );
}