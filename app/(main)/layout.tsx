"use client";

import { useEffect } from "react";
import { ColourToolSidebar } from "./_components/colour-tool-sidebar/colour-tool-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const preventNavigation = (event: KeyboardEvent) => {
            // Prevent page reload or navigation shortcuts
            if (
                // (event.ctrlKey && event.key.toLowerCase() === 'r') || // Ctrl + R
                (event.key === 'F5') || // F5
                (event.key === 'Backspace' && !isTextInput(event)) // Backspace (when not in text fields)
            ) {
                event.preventDefault();
                console.log('Navigation shortcut prevented.');
            }
        };

        const isTextInput = (event: KeyboardEvent): boolean => {
            const target = event.target as HTMLElement;
            return (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            );
        };

        window.addEventListener('keydown', preventNavigation);

        return () => {
            window.removeEventListener('keydown', preventNavigation);
        };
    }, []);
    
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