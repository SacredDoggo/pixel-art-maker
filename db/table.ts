import Database from "@tauri-apps/plugin-sql";

import { makeToast } from "@/lib/toast-manager";

// Check Table status
export const tableStatus = async (
    db: Database | null,
    {
        projects,
        project_config,
        colour_palettes,
        palette_groups,
        software_state
    }: {
        projects?: boolean;
        project_config?: boolean;
        colour_palettes?: boolean;
        palette_groups?: boolean;
        software_state?: boolean;
    }
): Promise<boolean> => {
    if (!db) return false;

    try {
        if (projects) {
            await db.execute(`CREATE TABLE IF NOT EXISTS project (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_name TEXT NOT NULL,
                height INTEGER NOT NULL,
                width INTEGER NOT NULL,
                grid_data TEXT NOT NULL
            );`);
        }
        if (project_config) {
            await db.execute(`CREATE TABLE IF NOT EXISTS project_config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                autosave INTEGER NOT NULL,
                pixel_size INTEGER NOT NULL,
                last_selected_colour TEXT NOT NULL,
                grid_lines_view INTEGER NOT NULL,
                last_selected_tool TEXT NOT NULL,
                undo_stack TEXT NOT NULL,
                redo_stack TEXT NOT NULL,
                FOREIGN KEY (project_id) REFERENCES project(id)
            );`);
        }
        if (colour_palettes) {
            await db.execute(`CREATE TABLE IF NOT EXISTS colour_palette (
                id INTEGER PRIMARY KEY,
                colour TEXT,
                project_id INTEGER,
                palette_group_id INTEGER,
                FOREIGN KEY (project_id) REFERENCES project(id),
                FOREIGN KEY (palette_group_id) REFERENCES palette_group(id)
            );`);
        }
        if (palette_groups) {
            await db.execute(`CREATE TABLE IF NOT EXISTS palette_group (
                id INTEGER PRIMARY KEY,
                group_name TEXT NOT NULL UNIQUE
            );`);
        }
        if (software_state) {
            await db.execute(`CREATE TABLE IF NOT EXISTS software_state (
                id INTEGER PRIMARY KEY,
                last_project_id INTEGER NOT NULL
            );`);
        }
        return true;
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
        return false;
    }
};
