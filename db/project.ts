import Database, { QueryResult } from "@tauri-apps/plugin-sql"
import { tableStatus } from "./table";
import { makeToast } from "@/lib/toast-manager";
import { createEmptyGrid } from "@/lib/utils";

export const insertProject = async (
    db: Database | null,
    project_name: string,
    height: number,
    width: number,
    grid_data?: string[][],
): Promise<Project | null> => {
    if (!db) return null;

    try {
        const tableOK = await tableStatus(db, { projects: true, project_config: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        const grid = grid_data ?? createEmptyGrid(width, height);

        const grid_str = JSON.stringify(grid);

        const project_query: QueryResult = await db.execute(
            "INSERT INTO project (project_name, height, width, grid_data) VALUES (?, ?, ?, ?);",
            [project_name, height, width, grid_str]
        );

        const project_config_query = await db.execute(
            "INSERT INTO project_config (project_id, autosave, pixel_size, last_selected_colour, grid_lines_view, last_selected_tool, undo_stack, redo_stack) values (?, ?, ?, ?, ?, ?, ?, ?);",
            [project_query.lastInsertId, 1, 5, "#000000", 0, "pen", "[]", "[]"]
        );

        const project: Project[] = await db.select("SELECT * FROM project WHERE id=?", [project_query.lastInsertId]);
        const config: ProjectConfig[] = await db.select("SELECT * FROM project_config WHERE id=?", [project_config_query.lastInsertId]);

        project[0].project_config = config[0];

        return project[0];
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
        if (!tableOK) throw new Error("Table creation or reading error in getProjects");

        const result: Project[] = await db.select("SELECT * FROM project");
        return result;
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered in getProjects",
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

        const project: Project[] = await db.select("SELECT * FROM project WHERE id=?", [id]);
        if (!project) return null;
        const config: ProjectConfig[] = await db.select("SELECT * FROM project_config WHERE id=?", [project[0].id]);

        project[0].project_config = config[0];

        return project[0];
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

        if (project_name) await db.execute("UPDATE project SET project_name=? WHERE id=?;", [project_name, id]);
        if (grid_data) await db.execute("UPDATE project SET grid_data=? WHERE id=?;", [JSON.stringify(grid_data), id]);
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
    }
};

export const updateProjectConfig = async (
    db: Database | null,
    project_id: number,
    update_data: {
        autosave: 0 | 1,
        pixel_size: number,
        last_selected_colour: string,
        grid_lines_view: 0 | 1,
        last_selected_tool: "pen" | "bucket" | "eraser",
        undo_stack: string[][][],
        redo_stack: string[][][]
    }
) => {
    if (!db || !project_id) return;

    try {
        const tableOK = await tableStatus(db, { project_config: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        const { autosave, pixel_size, last_selected_colour, grid_lines_view, last_selected_tool: last_selected_tool, undo_stack, redo_stack } = update_data;
        const undo_stack_str = JSON.stringify(undo_stack);
        const redo_stack_str = JSON.stringify(redo_stack);

        await db.execute(
            "UPDATE project_config SET autosave=?, pixel_size=?, last_selected_colour=?, grid_lines_view=?, last_selected_tool=?, undo_stack=?, redo_stack=? WHERE project_id=?;",
            [autosave, pixel_size, last_selected_colour, grid_lines_view, last_selected_tool, undo_stack_str, redo_stack_str, project_id]
        );
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
    project_id: number
) => {
    if (!db || !project_id) return;

    try {
        const tableOK = await tableStatus(db, { projects: true, project_config: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        await db.execute("DELETE FROM project WHERE id=?", [project_id])
        await db.execute("DELETE FROM project_config WHERE project_id=?", [project_id])
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
    }
};