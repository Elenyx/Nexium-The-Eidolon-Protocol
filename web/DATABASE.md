# Web App Database Configuration

## Overview

This web app operates in **READ-ONLY MODE** for the database. It connects to the bot's existing PostgreSQL database and displays data without modifying the database schema or structure.

## Database Roles

- **Bot (`/bot`)**: Primary database owner
  - Creates and manages all database tables
  - Handles all database migrations
  - Manages game data, user data, and all modifications

- **Web App (`/web`)**: Read-only consumer  
  - Connects to bot's existing database
  - Reads data through mapped storage layer
  - Does NOT create or modify database structure

## Disabled Scripts

The following database initialization scripts have been disabled to prevent conflicts:

- `init-db.js.disabled` - SQLite database initialization (was creating web-specific tables)
- `init-postgres.js.disabled` - PostgreSQL database initialization (was creating duplicate tables)
- `migrate-to-postgres.js.disabled` - Data migration script (not needed)
- `setup-postgres.js.disabled` - Database setup script (not needed)

## Database Schema Mapping

The web app maps its expected schema to the bot's actual tables:

| Web App Expected | Bot's Actual Table | Notes |
|------------------|-------------------|-------|
| `characters` | `user_eidolons` | Character/Eidolon data |
| `guilds` | `syndicates` | Guild/Syndicate data |
| `users` | `users` | Direct mapping |
| `battles` | `battles` | Battle history |
| `player_stats` | `player_stats` | Player statistics |

## Important Notes

- **Never run the disabled initialization scripts** - they will create conflicting tables
- **Database changes must be made in the bot project** - the web app only reads data
- **All migrations happen in the bot** - see `/bot/src/database/migrations/`
- **Web app storage layer** handles the schema mapping in `/web/server/storage.ts`

## Connection Configuration

The web app connects using the same `DATABASE_URL` environment variable as the bot, ensuring both applications use the same PostgreSQL database instance.
