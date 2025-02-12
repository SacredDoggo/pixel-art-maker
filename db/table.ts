import Database from "@tauri-apps/plugin-sql";

import { makeToast } from "@/lib/toast-manager";

// Check Table status
export const tableStatus = async (
    db: Database | null,
    {
        projects,
        colour_palettes,
        palette_groups
    }: {
        projects?: boolean
        colour_palettes?: boolean,
        palette_groups?: boolean
    }
): Promise<boolean> => {
    if (!db) return false;

    try {
        if (projects) {
            await db.execute(`CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_name TEXT NOT NULL,
                height INTEGER NOT NULL,
                width INTEGER NOT NULL,
                grid_data TEXT NOT NULL
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
