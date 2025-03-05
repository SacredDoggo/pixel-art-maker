import { makeToast } from '@/lib/toast-manager';
import Database from '@tauri-apps/plugin-sql';
import { tableStatus } from './table';

export const insertSoftwareState = async (
    db: Database | null,
    last_project_id: number,
) => {
    if (!db) return;

    try {
        await db.execute("DROP TABLE IF EXISTS software_state")

        const tableOK = await tableStatus(db, { software_state: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        await db.execute(`INSERT INTO software_state (last_project_id) values (?);`, [last_project_id]);
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
    }
};

export const getSoftwareState = async (
    db: Database | null,
): Promise<SoftwareState | undefined> => {
    if (!db) return;

    try {
        const tableOK = await tableStatus(db, { software_state: true });
        if (!tableOK) throw new Error("Table creation or reading error");

        const data: SoftwareState[] = await db.select("SELECT * FROM software_state");
        if (data.length == 0) return undefined;
        return data.at(-1);
    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);

        return undefined;
    }
};

export const clearSoftwareState = async (
    db: Database | null,
) => {
    if (!db) return;

    try {
        
        await db.execute("DROP TABLE IF EXISTS software_state")

    } catch (error) {
        makeToast({
            type: "error",
            message: "Database operation error encountered",
        });
        console.error('Database error:', error);
    }
};