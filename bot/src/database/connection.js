import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// ESM-safe __dirname
var __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load environment variables from the root of the 'bot' directory
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
var pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
pool.on('connect', function () {
    console.log('🔗 Connected to the database');
});
pool.on('error', function (err) {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
export default pool;
