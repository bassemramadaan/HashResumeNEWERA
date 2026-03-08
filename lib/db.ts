import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'cv_data.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS shared_cvs (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export const saveCV = (id: string, data: any) => {
  const stmt = db.prepare('INSERT INTO shared_cvs (id, data) VALUES (?, ?)');
  stmt.run(id, JSON.stringify(data));
};

export const getCV = (id: string) => {
  const stmt = db.prepare('SELECT data FROM shared_cvs WHERE id = ?');
  const result = stmt.get(id) as { data: string } | undefined;
  return result ? JSON.parse(result.data) : null;
};
