"use client";

import { PixelArtCanvas } from "@/components/canvas/canvas";
import { useProjectStore } from "@/store/project-store";

export const ProjectScreen = () => {
    const ps = useProjectStore();

    if (!ps.currentProject) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                No project selected...
            </div>
        );
    }
    return (
        <div className="min-w-min min-h-min">
            <PixelArtCanvas
                project_id={ps.currentProject.id}
                width={ps.currentProject.width}
                height={ps.currentProject.height}
            />
        </div>
    );
}