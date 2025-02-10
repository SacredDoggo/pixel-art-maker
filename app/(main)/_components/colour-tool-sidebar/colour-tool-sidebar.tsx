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
    }, [db]);

    // Handle colour click using Event Delegation
    const handleColourBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest(".colour-box");
        if (target && target.getAttribute("data-colour") != null) {
            const colour = target.getAttribute("data-colour");
            if (colour) cts.setCurrentColour(colour);
        }
    };

    return (
        <aside className="h-full w-[200px] p-1 overflow-auto space-y-1 bg-[#1f1f1f] z-50 relative">
            <div className="h-10 w-full p-1">
                <Button onClick={() => { insertColourPalette(db, "#ffffffff").then((data) => { setColourPalette(data) }) }}>Hello</Button>
            </div>
            <CurrentColourAndColourSelector 
                colour={cts.currentColour}
            />
            <ColourBoxContainer
                handleColourBoxClick={handleColourBoxClick}
                colourPalette={colourPalette}
            />
        </aside>
    );
}