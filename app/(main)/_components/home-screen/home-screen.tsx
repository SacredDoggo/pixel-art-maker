"use client";

import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";

export const HomeScreen = () => {
    const ps = useProjectStore();

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <Button onClick={ps.openNewProjectModal}>Create new project</Button>
            <span>or</span>
            <Button onClick={ps.openOpenProjectModal}>Open existing project</Button>
        </div>
    );
}