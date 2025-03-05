"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuPortal,
    DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { Item } from "./menu-item-component";
import { useProjectStore } from "@/store/project-store";
import { useDatabase } from "@/hooks/use-database";
import { softwareStateChanged } from "@/lib/utils";

export const NavbarItemFile = () => {
    const ps = useProjectStore();
    const db = useDatabase();

    const handleCloseProject = () => {
        ps.resetProjectStore();
        softwareStateChanged(db);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="hover:bg-[#333333] px-2 py-[2px]">File</div>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent
                    className="z-[99999] bg-black p-1 text-xs rounded-md shadow-lg min-w-[150px] data-[side=bottom]:animate-slideUpAndFade "
                    align="end"
                    alignOffset={100}
                >
                    <Item
                        label="New Project"
                        handleClick={ps.openNewProjectModal}
                    />
                    <Item
                        label="Open Project"
                        handleClick={ps.openOpenProjectModal}
                    />
                    <Item
                        label="Close Project"
                        handleClick={handleCloseProject}
                    />
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}