import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS prefix (
    gid TEXT PRIMARY KEY,
    prefix TEXT
  )
`);

export default {
    set: function (gid: string, prefix: string) {
      const stmt = db.prepare("INSERT OR REPLACE INTO prefix (gid, prefix) VALUES (?, ?)");
      stmt.run(gid, prefix);
    },

    get: function (gid: string): string {
      const stmt = db.prepare("SELECT prefix FROM prefix WHERE gid = ?");
      const row = stmt.get(gid) as { prefix: string } | undefined;
        
      return row ? row.prefix : "!";
    },

    reset: function (gid: string) {
      const stmt = db.prepare("DELETE FROM prefix WHERE gid = ?");
      stmt.run(gid);
    }
}