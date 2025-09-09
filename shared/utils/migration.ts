import fs from 'fs';
import path from 'path';
import type Database from 'better-sqlite3';

/**
 * Runs all .sql migration files in a directory against the provided database.
 * @param db The SQLite database connection
 * @param migrationsDir Directory containing .sql migration files
 */
export function runMigrations(db: Database.Database, migrationsDir: string): void {
	const files = fs.readdirSync(migrationsDir)
		.filter(f => f.endsWith('.sql'))
		.sort();
	for (const file of files) {
		const filePath = path.join(migrationsDir, file);
		const sql = fs.readFileSync(filePath, 'utf-8');
		db.exec(sql);
		// Optionally log applied migration
		console.log(`\u2705 Migration applied: ${file}`);
	}
}
