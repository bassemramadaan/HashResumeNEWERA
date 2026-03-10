import 'server-only';

// In-memory store for preview environment
const db = new Map<string, any>();

export const saveCV = (id: string, data: any) => {
  db.set(id, data);
};

export const getCV = (id: string) => {
  return db.get(id) || null;
};
