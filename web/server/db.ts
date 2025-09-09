import { Pool } from "pg";
import path from "path";
import fs from "fs";
import { log } from "./vite";

// Use a default SQLite database path if DATABASE_URL is not provided
const DEFAULT_DB_PATH = path.resolve(process.cwd(), "../shared/data/nexium.db");
const dbUrl = process.env.DATABASE_URL || `sqlite:${DEFAULT_DB_PATH}`;

// Ensure the directory exists for SQLite
if (dbUrl.startsWith("sqlite:")) {
  const dbFilePath = dbUrl.substring(7);
  const dbDir = path.dirname(dbFilePath);
  
  if (!fs.existsSync(dbDir)) {
    log(`Creating directory for SQLite database: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  log(`Using SQLite database at: ${dbFilePath}`);
} else {
  log(`Using PostgreSQL database connection`);
}

export const pool = new Pool({ connectionString: dbUrl });
export const db = pool;
