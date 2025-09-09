import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Create and return a PostgreSQL database connection pool.
 */
export function getDatabaseConnection(): Pool {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
	return new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
	});
}

/**
 * Close a PostgreSQL database connection pool.
 * @param pool The pool instance
 */
export function closeDatabaseConnection(pool: Pool): void {
	pool.end();
}
