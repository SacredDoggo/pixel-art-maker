"use client";

import { ColourToolSidebar } from "./_components/colour-tool-sidebar/colour-tool-sidebar";

const MainLayout = ({ children } : {children: React.ReactNode}) => {
    return (
        <div className="flex h-full w-full bg-[#333333]">
            <ColourToolSidebar />
            {children}
        </div>
    );
}

export default MainLayout;