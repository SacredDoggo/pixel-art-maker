import Database, { QueryResult } from "@tauri-apps/plugin-sql"
import { tableStatus } from "./table";
import { makeToast } from "@/lib/toast-manager";
import { createEmptyGrid } from "@/lib/utils";

export const insertProject = async (
    db: Database | null,
    project_name: string,
    height: number,
    width: number,
    grid_data?: string[][]
): Promise<Project | null> => {
    if (!db) return null;

    try {
        const tableOK = await tableStatus(db, { projects: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        const grid = grid_data ?? createEmptyGrid(width, height);

        const qr: QueryResult = await db.execute(
            "INSERT INTO project (project_name, height, width, grid_data) VALUES (?, ?, ?, ?);",
            [project_name, height, width, JSON.stringify(grid)]
        );

        const result: Project = await db.select("SELECT * FROM project WHERE id=?", [qr.lastInsertId]);
        return result;
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);

        return null;
    }

};

export const getProjects = async (
    db: Database | null,
): Promise<Project[]> => {
    if (!db) return [];

    try {
        const tableOK = await tableStatus(db, { projects: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        const result: Project[] = await db.select("SELECT * FROM project");
        return result;
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);

        return [];
    }
};

export const getProjectById = async (
    db: Database | null,
    id: number
): Promise<Project | null> => {
    if (!db) return null;

    try {
        const tableOK = await tableStatus(db, { projects: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        const result: Project = await db.select("SELECT * FROM project WHERE id=?", [id]);
        return result;
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);

        return null;
    }
};

export const updateProject = async (
    db: Database | null,
    id: number,
    project_name?: string,
    grid_data?: string[][]
) => {
    if (!db || !id) return;
    if (!project_name && !grid_data) return;

    try {
        const tableOK = await tableStatus(db, { projects: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        if (project_name) await db.execute("UPDATE project SET project_name=? WHERE id=?);", [project_name, id]);
        if (grid_data) await db.execute("UPDATE project SET grid_data=? WHERE id=?);", [JSON.stringify(grid_data), id]);
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
    }
};

export const deleteProject = async (
    db: Database | null,
    id: number
) => {
    if (!db || !id) return;

    try {
        const tableOK = await tableStatus(db, { projects: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        await db.execute("DELETE FROM project WHERE id=?", [id])
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
    }
};