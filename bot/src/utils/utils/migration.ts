import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

/**
 * Runs all .sql migration files in a directory against the provided database.
 * @param pool The PostgreSQL connection pool
 * @param migrationsDir Directory containing .sql migration files
 */
export async function runMigrations(pool: Pool, migrationsDir: string): Promise<void> {
	const files = fs.readdirSync(migrationsDir)
		.filter(f => f.endsWith('.sql'))
		.sort();
	for (const file of files) {
		const filePath = path.join(migrationsDir, file);
		const sql = fs.readFileSync(filePath, 'utf-8');
		await pool.query(sql);
		// Optionally log applied migration
		console.log(`✅ Migration applied: ${file}`);
	}
}
