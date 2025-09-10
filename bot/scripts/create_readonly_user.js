#!/usr/bin/env node
/*
Create a read-only database role and print the connection URL.

Usage (PowerShell):
  $env:DATABASE_URL = '<SUPERUSER_DB_URL>'
  node scripts/create_readonly_user.js

The script reads DATABASE_URL from the environment, generates a strong password,
creates role `web_readonly`, grants CONNECT/USAGE/SELECT privileges, and prints
the resulting connection string for the read-only user.
*/
import { randomBytes } from 'crypto';
import pkg from 'pg';
const { Client } = pkg;

function genPassword(len = 24) {
  return randomBytes(len).toString('base64').replace(/\/+|\+/g, 'A').slice(0, len);
}

async function main() {
  const superUrl = process.env.DATABASE_URL;
  if (!superUrl) {
    console.error('DATABASE_URL must be set to a superuser connection string');
    process.exit(1);
  }

  const roUser = 'web_readonly';
  const roPassword = genPassword(24);

  const client = new Client({ connectionString: superUrl });
  try {
    await client.connect();
    console.log('Connected to DB as superuser');

    // Parse DB name and host components to build a readonly URL later
    const url = new URL(superUrl);
    const dbName = url.pathname.replace(/^\//, '') || 'postgres';

    // Create role if not exists, set password
    await client.query(`DO $$\nBEGIN\n  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${roUser}') THEN\n    CREATE ROLE ${roUser} WITH LOGIN PASSWORD '${roPassword}';\n  ELSE\n    ALTER ROLE ${roUser} WITH PASSWORD '${roPassword}';\n  END IF;\nEND$$;`);
    console.log(`Created/updated role '${roUser}'`);

    // Grant privileges
    await client.query(`GRANT CONNECT ON DATABASE \"${dbName}\" TO ${roUser};`);
    await client.query(`GRANT USAGE ON SCHEMA public TO ${roUser};`);
    await client.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${roUser};`);
    await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ${roUser};`);
    console.log('Granted CONNECT/USAGE/SELECT privileges to read-only user');

    // Build read-only connection string
    url.username = encodeURIComponent(roUser);
    url.password = encodeURIComponent(roPassword);
    const readonlyUrl = url.toString();

    console.log('\n=== READ-ONLY DATABASE URL ===');
    console.log(readonlyUrl);
    console.log('==============================\n');

    console.log('Tip: set the web service DATABASE_URL to the read-only URL in production.');
  } catch (err) {
    console.error('Error creating read-only user:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();

// Grant privileges for web user
    const webUser = 'web_user';
    const webPassword = genPassword(24);

    await client.query(`DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${webUser}') THEN
    CREATE ROLE ${webUser} WITH LOGIN PASSWORD '${webPassword}';
  ELSE
    ALTER ROLE ${webUser} WITH PASSWORD '${webPassword}';
  END IF;
END$$;`);
    console.log(`Created/updated role '${webUser}'`);

    // Grant privileges for web user
    await client.query(`GRANT CONNECT ON DATABASE "${dbName}" TO ${webUser};`);
    await client.query(`GRANT USAGE ON SCHEMA public TO ${webUser};`);
    await client.query(`GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO ${webUser};`);
    await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO ${webUser};`);
    console.log('Granted CONNECT/USAGE/SELECT/INSERT/UPDATE privileges to web user');
