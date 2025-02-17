"use client";

import { useProjectStore } from "@/store/use-project-store";
import { FormEvent, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormSubmit
} from "@radix-ui/react-form";
import { CircleAlertIcon } from "lucide-react";
import { makeToast } from "@/lib/toast-manager";
import { insertProject } from "@/db/project";
import { useDatabase } from "@/hooks/use-database";

export const NewProjectModal = () => {
    const db = useDatabase();
    const ps = useProjectStore();

    const [projectName, setProjectName] = useState("");
    const [canvasHeight, setCanvasHeight] = useState<number | string>("");
    const [canvasWidth, setCanvasWidth] = useState<number | string>("");

    // Close the new project modal 
    const handleClose = () => {
        ps.closeNewProjectModal();
    };

    // Handle Confirm
    const handleCreate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const height = typeof canvasHeight === "string" ? parseInt(canvasHeight, 10) : canvasHeight;
        const width = typeof canvasWidth === "string" ? parseInt(canvasWidth, 10) : canvasWidth;

        if (
            isNaN(height) || height < 1 || height > 512 ||
            isNaN(width) || width < 1 || width > 512 ||
            projectName.length == 0
        ) {
            makeToast({
                type: "error",
                message: "Input invalid"
            });

            return;
        }

        const operations = async () => {
            try {
                const project = await insertProject(db, projectName, canvasHeight ? +canvasHeight : 32, canvasWidth ? +canvasWidth : 32);
                if (!project) throw new Error();

                makeToast({
                    type: "success",
                    message: `New project created: ${projectName}`
                });
                ps.setCurrentProject(project);
                handleClose();
            } catch (error) {
                makeToast({
                    type: "error",
                    message: "Error while creating new Project"
                });
                console.error(error);
            }
        };

        operations();
    };

    return (
        <>
            {ps.isNewProjectModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
                    <div className="relative w-[450px] z-50 font-mono bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <p className="w-full text-center text-xl font-bold">Create new project</p>
                        <div className="h-[1px] bg-white w-full my-2" />
                        <Form onSubmit={handleCreate}>
                            <div className="w-full flex flex-col gap-y-1">
                                <FormField name="project_name">
                                    <FormMessage match="valueMissing">Please provide a project name</FormMessage>
                                    <FormControl asChild>
                                        <input
                                            className="appearance-none w-full focus:outline-none focus:ring-0 bg-gray-600 rounded-sm px-2 py-1"
                                            value={projectName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                                            autoComplete="off"
                                            placeholder="Project name"
                                            required
                                        />
                                    </FormControl>
                                </FormField>
                                <div className="flex w-full gap-x-1">
                                    <FormField name="canvas_height" className="w-full">
                                        <FormControl asChild>
                                            <input
                                                className="appearance-none w-full focus:outline-none focus:ring-0 bg-gray-600 rounded-sm px-2 py-1 hide-spinner"
                                                value={canvasHeight}
                                                type="number"
                                                min={1}
                                                max={512}
                                                placeholder="Height: 1 <= y <=512"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCanvasHeight(e.target.value)}
                                                autoComplete="off"
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage match="valueMissing" className="flex items-center">
                                            <CircleAlertIcon className="h-4 w-4 mr-2" /> Required
                                        </FormMessage>
                                        <FormMessage match="rangeUnderflow">{`Out of range, x >= 1`}</FormMessage>
                                        <FormMessage match="rangeOverflow">{`Out of range, x <= 512`}</FormMessage>
                                    </FormField>
                                    <FormField name="canvas_width" className="w-full">
                                        <FormControl asChild>
                                            <input
                                                className="appearance-none w-full focus:outline-none focus:ring-0 bg-gray-600 rounded-sm px-2 py-1 hide-spinner"
                                                value={canvasWidth}
                                                type="number"
                                                min={1}
                                                max={512}
                                                placeholder="Width: 1 <= x <=512"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCanvasWidth(e.target.value)}
                                                autoComplete="off"
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage match="valueMissing" className="flex items-center">
                                            <CircleAlertIcon className="h-4 w-4 mr-2" /> Required
                                        </FormMessage>                                        <FormMessage match="rangeUnderflow">{`Out of range, x >= 1`}</FormMessage>
                                        <FormMessage match="rangeOverflow">{`Out of range, x <= 512`}</FormMessage>
                                    </FormField>
                                </div>
                                <FormSubmit
                                    type="submit"
                                    className="bg-gray-700 hover:bg-gray-900 rounded-sm transition"
                                >
                                    Create
                                </FormSubmit>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
}