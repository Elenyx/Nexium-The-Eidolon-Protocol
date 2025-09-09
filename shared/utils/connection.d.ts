import Database from 'better-sqlite3';
/**
 * Create and return a SQLite database connection.
 * @param dbPath Path to the SQLite database file
 */
export declare function getDatabaseConnection(dbPath: string): Database.Database;
/**
 * Close a SQLite database connection.
 * @param db The database instance
 */
export declare function closeDatabaseConnection(db: Database.Database): void;
