import { clearSoftwareState, insertSoftwareState } from "@/db/software-state";
import Database from "@tauri-apps/plugin-sql";

// Create empty canvas grid
export const createEmptyGrid = (width: number, height: number): string[][] => {
    return Array.from({ length: height }, () =>
        Array.from({ length: width }, () => "#ffffff00")
    );
};

export const softwareStateChanged = (db: Database | null, last_project_id?: number) => {
    if (!last_project_id) {
        clearSoftwareState(db);
    }
    else {
        insertSoftwareState(db, last_project_id);
    }
}