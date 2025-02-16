import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

import { LucideIcon } from "lucide-react";

interface UtilityButtonProps {
    handleClick: () => void;
    toolTipMessage: string;
    icon: LucideIcon,
    active?: boolean
}

export const UtilityButton = ({
    handleClick,
    toolTipMessage,
    icon: Icon,
    active
}: UtilityButtonProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div
                className={`hover:bg-[#3f3f3f] p-2 rounded-sm transition cursor-pointer ${active && "bg-[#3f3f3f]"}`}
                    onClick={handleClick}
                >
                    <Icon className="h-4 w-4" />
                </div>

            </TooltipTrigger>
            <TooltipContent className="bg-white text-black p-2 text-xs shadow-lg rounded-sm" sideOffset={5} side={"top"}>
                {toolTipMessage}
            </TooltipContent>
        </Tooltip>
    );
};