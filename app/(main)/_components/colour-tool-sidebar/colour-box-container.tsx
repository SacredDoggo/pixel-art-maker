import { ColourPalette } from "@/db/tauri-sqlite-db";
import { ColourBox } from "./colour-box";

interface ColourBoxContainerProps {
    handleColourBoxClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    colourPalette: ColourPalette[];
}

export const ColourBoxContainer = ({
    handleColourBoxClick,
    colourPalette
}: ColourBoxContainerProps) => {
    return (
        <div
            className="w-full bg-[#333333] h-[300px] p-2 overflow-auto colour-box-container rounded-md"
            onClick={handleColourBoxClick}
        >
            <div className="flex flex-wrap gap-1 items-start">
                {colourPalette?.map((colour) => (
                    <ColourBox
                        key={colour.id}
                        colour={colour.colour}
                    />
                ))}
            </div>
        </div>
    );
}