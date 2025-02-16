"use client";

import { useEffect, useState } from "react";

import { PixelArtCanvas } from "@/components/canvas/canvas";
import { useProjectStore } from "@/store/use-project-store";

export const ProjectScreen = () => {
    const ps = useProjectStore();

    const [loading, setLoading] = useState(true);
    const [gridData, setGridData] = useState<string[][]>([]);

    useEffect(() => {
        setLoading(true);
        const loadGridData = async () => {
            if (!ps.currentProject) return;
            const data = await JSON.parse(ps.currentProject.grid_data);
            setGridData(data);
            setLoading(false);
        }
        loadGridData();
    }, [ps.currentProject])

    if (!ps.currentProject || loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                Loading...
            </div>
        );
    }
    return (
        <div className="min-w-min min-h-min">
            <PixelArtCanvas
                project_id={ps.currentProject.id}
                width={ps.currentProject.width}
                height={ps.currentProject.height}
                gridDataPrev={gridData}
            />
        </div>
    );
}