import { makeToast } from '@/lib/toast-manager';
import Database from '@tauri-apps/plugin-sql';

// Example function to test the database
export const testDB = async (db: Database | undefined) => {
  if (!db) return;

  try {
    await db.execute('CREATE TABLE IF NOT EXISTS todos(id INTEGER PRIMARY KEY ASC, title TEXT, status TEXT)');
    await db.execute('INSERT INTO todos (title, status) VALUES (?, ?)', ['Learn Tauri', 'pending']);
    const result = await db.select('SELECT * FROM todos');
  } catch (error) {
    console.error('Database error:', error);
  }
};

// Check Table status
const tableStatus = async (
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
      const p = await db.execute(`CREATE TABLE IF NOT EXISTS project (
        id INTEGER PRIMARY KEY, 
        project_name TEXT NOT NULL UNIQUE
      );`);
    }
    if (colour_palettes) {
      const cp = await db.execute(`CREATE TABLE IF NOT EXISTS colour_palette (
        id INTEGER PRIMARY KEY,
        colour TEXT,
        project_id INTEGER,
        palette_group_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES project(id),
        FOREIGN KEY (palette_group_id) REFERENCES palette_group(id)
      );`);
    }
    if (palette_groups) {
      const cp = await db.execute(`CREATE TABLE IF NOT EXISTS palette_group (
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

// Colour Palette 
export interface ColourPalette {
  id: number;
  colour: string;
  project_id?: number;
  palette_group_id?: number;
}

export const insertColourPalette = async (
  db: Database | null,
  colour: string,
  project_name?: string,
  palette_group_name?: string
): Promise<ColourPalette[]> => {
  if (!db) return [];

  try {
    if (project_name && palette_group_name) {
      const tableOK = await tableStatus(db, { colour_palettes: true, projects: true, palette_groups: true });

      if (!tableOK) throw new Error("Table creation or reading error");

      await db.execute("INSERT OR IGNORE INTO project (project_name) VALUES (?));", [project_name]);
      await db.execute("INSERT OR IGNORE INTO palette_group (group_name) VALUES (?);", [palette_group_name]);
      await db.execute(`INSERT INTO colour_palette (colour, project_id, palette_group_id)
        VALUES (
        ?, 
        (SELECT id FROM projects WHERE project_name = ?),
        (SELECT id FROM palette_groups WHERE group_name = ?)
      );`, [colour, project_name, palette_group_name]);

      const result: ColourPalette[] = await db.select('SELECT * FROM colour_palette');
      return result;
    }

    else if (project_name) {
      const tableOK = await tableStatus(db, { colour_palettes: true, projects: true });

      if (!tableOK) throw new Error("Table creation or reading error");

      await db.execute("INSERT OR IGNORE INTO project (project_name) VALUES (?));", [project_name]);
      await db.execute(`INSERT INTO colour_palette (colour, project_id, palette_group_id)
        VALUES (
        ?, 
        (SELECT id FROM projects WHERE project_name = ?),
        NULL
      );`, [colour, project_name]);

      const result: ColourPalette[] = await db.select('SELECT * FROM colour_palette');
      return result;
    }

    else if (palette_group_name) {
      const tableOK = await tableStatus(db, { colour_palettes: true, palette_groups: true });

      if (!tableOK) throw new Error("Table creation or reading error");

      await db.execute("INSERT OR IGNORE INTO palette_group (group_name) VALUES (?);", [palette_group_name]);
      await db.execute(`INSERT INTO colour_palette (colour, project_id, palette_group_id)
        VALUES (
        ?, 
        NULL,
        (SELECT id FROM palette_groups WHERE group_name = ?)
      );`, [colour, palette_group_name]);

      const result: ColourPalette[] = await db.select('SELECT * FROM colour_palette');
      return result;
    }

    else {
      const tableOK = await tableStatus(db, { colour_palettes: true, palette_groups: true });

      if (!tableOK) throw new Error("Table creation or reading error");

      await db.execute(`INSERT INTO colour_palette (colour, project_id, palette_group_id)
        VALUES (
        ?, 
        NULL,
        NULL
      );`, [colour]);

      const result: ColourPalette[] = await db.select('SELECT * FROM colour_palette');
      return result;
    }
  } catch (error) {
    makeToast({
      type: "error",
      message: "Database operation error encountered",
    });
    console.error('Database error:', error);

    return [];
  }
};

// TODO: Handle Filter parameters
export const getColourPalette = async (
  db: Database | null,
  project_id?: number,
  project_name?: string,
  palette_group_id?: number,
  palette_group_name?: string
): Promise<ColourPalette[]> => {
  if (!db) return [];

  try {
    const tableOK = await tableStatus(db, { colour_palettes: true, projects: true, palette_groups: true });

    if (!tableOK) throw new Error("Table creation or reading error");

    const result: ColourPalette[] = await db.select(`
        SELECT 
          cp.id,
          cp.colour,
          cp.project_id,
          cp.palette_group_id,
          p.project_name,
          pg.group_name
        FROM colour_palette cp
        LEFT JOIN project p ON cp.project_id = p.id
        LEFT JOIN palette_group pg ON cp.palette_group_id = pg.id;
      `);
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

export const editColourPalette = async (
  db: Database | null, 
  colour_id: number, 
  newColour: string
): Promise<ColourPalette[]> => {
  if (!db) return [];
  try {
    const tableOK = await tableStatus(db, { colour_palettes: true });

    if (!tableOK) throw new Error("Table creation or reading error");

    await db.execute("UPDATE colour_palette SET colour=? where id=?", [newColour, colour_id]);

    const result: ColourPalette[] = await db.select('SELECT * FROM colour_palette');
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

export const deleteColour = async (db: Database | null, colour_id: number): Promise<ColourPalette[]> => {
  if (!db) return [];
  try {
    const tableOK = await tableStatus(db, { colour_palettes: true });

    if (!tableOK) throw new Error("Table creation or reading error");

    await db.execute("DELETE FROM colour_palette where id=?", [colour_id]);

    const result: ColourPalette[] = await db.select('SELECT * FROM colour_palette');
    return result;
  } catch (error) {
    makeToast({
      type: "error",
      message: "Database operation error encountered",
    });
    console.error('Database error:', error);

    return [];
  }
}