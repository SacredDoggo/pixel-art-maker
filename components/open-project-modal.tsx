"use client";

import { useEffect, useState } from "react";

import { useProjectStore } from "@/store/use-project-store";
import { useDatabase } from "@/hooks/use-database";
import { getProjectById, getProjects } from "@/db/project";
import { makeToast } from "@/lib/toast-manager";

export const OpenProjectModal = () => {
    const db = useDatabase();
    const ps = useProjectStore();

    const [projects, setProjects] = useState<Project[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState<string>("");

    useEffect(() => {
        getProjects(db).then((data) => {
            setProjects(data);
            setLoading(false);
        });
    }, [db, ps.isOpenProjectModalOpen]);

    const filteredSearchProjects = projects?.filter((project) => {
        return project.project_name.toLowerCase().includes(searchVal.trim().toLowerCase());
    });

    // Handle project click using Event Delegation
    const handleProjectClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLElement).closest(".project");
        if (!target) return;

        if (target.getAttribute("project-id") != null) {
            const id = target.getAttribute("project-id");
            if (!id) return;
            const project = await getProjectById(db, parseInt(id));
            if (e.button == 0) {
                if (project) {
                    ps.setCurrentProject(project);
                    handleClose();
                }
                else makeToast({
                    type: "error",
                    message: "Error while loading project"
                })
            }
        }
    };

    const handleClose = () => {
        ps.closeOpenProjectModal();
    };

    return (
        <>
            {ps.isOpenProjectModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
                    <div className="relative w-[600px] z-50 bg-white font-mono dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <p className="w-full text-center text-xl font-bold">Choose a project</p>
                        <div className="h-[1px] bg-white w-full my-2" />
                        <div
                            className="w-full max-h-[300px] flex flex-col gap-y-2 overflow-y-auto"
                            onClick={handleProjectClick}
                        >
                            <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} className="hidden" />
                            {!filteredSearchProjects && !loading && <span>No projects found</span>}
                            {loading && <span>Loadng...</span>}
                            {filteredSearchProjects?.reverse().map((project) => (
                                <div
                                    key={project.id}
                                    className="project flex flex-col bg-gray-900 hover:bg-gray-700 cursor-pointer p-2 rounded-md"
                                    project-id={project.id}
                                >
                                    <span>{project.project_name}</span>
                                    <div className="flex text-xs text-gray-500 gap-x-2">
                                        <span>{`height:{${project.height}}`}</span>
                                        <span>{`width:{${project.width}}`}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}