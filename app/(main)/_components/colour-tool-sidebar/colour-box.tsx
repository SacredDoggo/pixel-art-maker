import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipTrigger
} from "@radix-ui/react-tooltip";

interface ColourBoxProps {
    id: number;
    colour: string;
    className?: string;
}

export const ColourBox = ({
    id,
    colour,
    className
}: ColourBoxProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                    className={"colour-box h-8 w-8 shadow cursor-pointer border-2 " + className}
                    style={{ backgroundColor: colour }}
                    data-colour={colour}
                    data-colour-id={id}
                ></div>
            </TooltipTrigger>
            <TooltipContent className="bg-black p-1 text-xs shadow-lg rounded-md" sideOffset={5} side={"right"}>
                {colour}
                <TooltipArrow className="TooltipArrow" />
            </TooltipContent>
        </Tooltip>
    );
}