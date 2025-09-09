import type Database from 'better-sqlite3';
/**
 * Runs all .sql migration files in a directory against the provided database.
 * @param db The SQLite database connection
 * @param migrationsDir Directory containing .sql migration files
 */
export declare function runMigrations(db: Database.Database, migrationsDir: string): void;
