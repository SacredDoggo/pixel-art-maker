import Database from "@tauri-apps/plugin-sql";

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
