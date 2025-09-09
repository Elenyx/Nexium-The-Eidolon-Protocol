import Database from 'better-sqlite3';
/**
 * Create and return a SQLite database connection.
 * @param dbPath Path to the SQLite database file
 */
export function getDatabaseConnection(dbPath) {
    if (!dbPath)
        throw new Error('Database path is required');
    return new Database(dbPath, { verbose: console.log });
}
/**
 * Close a SQLite database connection.
 * @param db The database instance
 */
export function closeDatabaseConnection(db) {
    db.close();
}
