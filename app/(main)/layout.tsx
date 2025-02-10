"use client";

import { ColourToolSidebar } from "./_components/colour-tool-sidebar/colour-tool-sidebar";

const MainLayout = ({ children } : {children: React.ReactNode}) => {
    return (
        <div className="flex h-full w-full bg-[#1f1f1f]">
            <ColourToolSidebar />
            {children}
        </div>
    );
}

export default MainLayout;