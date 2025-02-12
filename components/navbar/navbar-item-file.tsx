"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuPortal,
    DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { Item } from "./menu-item-component";

export const NavbarItemFile = () => {
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
                        handleClick={() => { }}
                    />
                    <Item
                        label="Open Project"
                        handleClick={() => { }}
                    />
                    <Item
                        label="Close Project"
                        handleClick={() => { }}
                    />
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}