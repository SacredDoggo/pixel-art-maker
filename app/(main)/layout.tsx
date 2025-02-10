"use client";

import { useEffect } from "react";
import { ColourToolSidebar } from "./_components/colour-tool-sidebar/colour-tool-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div 
            className="flex h-full w-full bg-[#1f1f1f]"
            onContextMenu={(e) => { e.preventDefault() }}
        >
            <ColourToolSidebar />
            {children}
        </div>
    );
}

export default MainLayout;