"use client";

import { useProjectStore } from "@/store/project-store";
import { useRef, useState } from "react";
import { makeToast } from "@/lib/toast-manager";
import { getProjectById } from "@/db/project";
import { useDatabase } from "@/hooks/use-database";
import { useExportStore } from "@/store/export-store";
import { NumberConstrainedUtilityInput } from "../number-constrained-utility-input";

export const ExportCanvasModal = () => {
    const db = useDatabase();
    const ps = useProjectStore();
    const es = useExportStore();

    const [exportPixelSize, setExportPixelSize] = useState<number>(1);
    const [exportType, setExportType] = useState<"png" | "jpeg">("png");

    const dummyCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Close the new project modal 
    const handleClose = () => {
        es.closeExportModal();
    };

    // Handle export click
    const handleExportClick = async () => {
        try {
            const dummyCanvas = dummyCanvasRef.current;
            if (!dummyCanvas) return;
            const ctx = dummyCanvas.getContext("2d");
            if (!ctx) return;
            // Clear entire canvas.
            ctx.clearRect(0, 0, dummyCanvas.width, dummyCanvas.height);

            if (!ps.currentProject) return;

            const projectData = await getProjectById(db, ps.currentProject.id);

            if (!projectData) return;

            dummyCanvas.width = projectData.width * exportPixelSize;
            dummyCanvas.height = projectData.height * exportPixelSize;

            const gridData = await JSON.parse(projectData.grid_data);

            // Draw each cell from gridData.
            for (let row = 0; row < projectData.height; row++) {
                for (let col = 0; col < projectData.width; col++) {
                    ctx.fillStyle = gridData[row][col];
                    ctx.fillRect(col * exportPixelSize, row * exportPixelSize, exportPixelSize, exportPixelSize);
                }
            }
            // Convert canvas to data URL (MIME type image/png or image/jpeg)
            const dataUrl = dummyCanvas.toDataURL(`image/${exportType}`);
            // Create an anchor element and trigger a download
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${projectData.project_name}.${exportType}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            handleClose();
        } catch (error) {
            makeToast({
                type: "error",
                message: "Failed to export file!"
            });
            console.error(error);
        }
    }


    if (!ps.currentProject) {
        return (
            <>
                {es.isExportModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
                        <div className="relative w-[450px] z-50 font-mono bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                            <p className="w-full text-center text-xl font-bold">No project selected!</p>
                        </div>
                    </div>
                )}
            </>
        );
    }


    return (
        <>
            {es.isExportModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
                    <div className="relative w-[450px] z-50 font-mono bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <p className="w-full text-center text-xl font-bold">Export {ps.currentProject?.project_name}</p>
                        <div className="h-[1px] bg-white w-full my-2" />

                        <div className="flex flex-col gap-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="mr-2">Pixel Size:</span>
                                    <NumberConstrainedUtilityInput
                                        data={exportPixelSize}
                                        setData={setExportPixelSize}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className={`px-2 py-1 border-[1px] border-r-0 w-14 rounded-l-md ${exportType === "png" && "bg-blue-500 hover:bg-blue-600"} transition`}
                                        onClick={() => { setExportType("png") }}
                                    >
                                        PNG
                                    </button>
                                    <button
                                        className={`px-2 py-1 border-[1px] w-14 rounded-r-md ${exportType === "jpeg" && "bg-blue-500 hover:bg-blue-600"} transition`}
                                        onClick={() => { setExportType("jpeg") }}
                                    >
                                        JPEG
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    className="rounded-sm py-1 px-4 bg-gray-900 hover:bg-gray-700"
                                    onClick={handleExportClick}
                                >
                                    Export
                                </button>
                            </div>
                        </div>

                    </div>
                    <canvas
                        ref={dummyCanvasRef}
                        className="hidden"
                    />
                </div>
            )}
        </>
    );
}