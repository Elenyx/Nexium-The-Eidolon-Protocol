# Nexium RPG Monorepo Structure & Shared Database Utilities

![Build Status](https://img.shields.io/github/actions/workflow/status/Elenyx/Nexium-The-Eidolon-Protocol/ci.yml?branch=main&label=build)
![License](https://img.shields.io/github/license/Elenyx/Nexium-The-Eidolon-Protocol)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)


# Nexium RPG Monorepo Structure & Shared Database Utilities

## Detailed Project Structure

```text
nexium-rpg/
├── bot/
│   ├── src/
│   │   ├── database/           # Bot-specific database code
│   │   └── ...
│   └── data/                   # Bot database files
├── web/
│   ├── server/
│   ├── shared/
│   └── data/                   # Web database files (if separate)
└── shared/                     # Shared database utilities & schema
    ├── database/
    │   ├── schema/             # core.sql, users.sql, game.sql
    │   ├── seeds/              # core-data.sql, game-data.sql
    │   ├── utils/              # connection.ts, migration.ts, validator.ts
    │   └── types/              # database.ts
    └── package.json            # Shared dependencies

```

## Shared Database Utilities

- **Schema**: SQL files in `shared/database/schema/` define all core tables (users, items, eidolons, syndicates, etc.).
- **Seeds**: Example data in `shared/database/seeds/` for development/testing.
- **Utils**: TypeScript helpers for database connection, migrations, and validation in `shared/database/utils/`.
- **Types**: TypeScript interfaces for all tables in `shared/database/types/database.ts`.

## Usage

### Bot & Web Projects

1. **Import shared utilities and types:**
   - Example: `import { getDatabaseConnection } from '../../shared/database/utils/connection';`
   - Example: `import type { User } from '../../shared/database/types/database';`

2. **Apply schema and seeds:**
   - Use the migration utility to apply all SQL files in `shared/database/schema/` to your SQLite database.
   - Example:

```ts
import { getDatabaseConnection } from '../../shared/database/utils/connection';
import { runMigrations } from '../../shared/database/utils/migration';
const db = getDatabaseConnection('./data/bot.db');
runMigrations(db, '../../shared/database/schema');
```

1. **Environment configuration:**
   - Use a shared or separate database file as needed (see `.env` or config docs).

1. **Extend schema:**
   - Add new tables or columns in `shared/database/schema/` and update types in `shared/database/types/database.ts`.

## Contributing to Shared Code

- Update shared schema/types/utilities in the `shared/` folder for changes affecting both bot and web.
- Keep project-specific logic in `bot/` or `web/` as needed.

## Benefits

- **Consistency:** One source of truth for schema and types.
- **Reusability:** Shared code for both bot and web.
- **Maintainability:** Easier updates and onboarding.

## Project Overview

## Project Name and Description

**Nexium-The-Eidolon-Protocol** is a multi-component project featuring an anime-themed Discord RPG bot and a modern web dashboard. It enables users to collect characters, engage in battles, participate in guild wars, and interact through forums. The system includes a TypeScript/Node.js backend for Discord bot logic, a React + Vite web frontend, and a PostgreSQL database layer. Users authenticate via Discord OAuth and can manage their collections, view battle histories, participate in leaderboards, and join community discussions.

---

## Technology Stack

- **Languages:** TypeScript (primary), JavaScript, SQL
- **Backend:** Node.js (v18+), Discord.js, Drizzle ORM
- **Frontend:** React 18, Vite, TailwindCSS, Radix UI, shadcn/ui
- **Database:** PostgreSQL (Neon serverless), Drizzle ORM
- **Testing:** Jest (bot), Vitest (web)
- **Other:** Express.js, TanStack Query, Zod, date-fns, Discord OAuth 2.0

---

## Project Architecture

### High-Level Overview

- **Monorepo**: Contains both bot and web projects with shared code
- **Bot**: Discord RPG bot (Node.js/TypeScript)
- **Web**: React app (Vite, TailwindCSS, Radix UI)
- **Database**: PostgreSQL with Drizzle ORM, schema-first migrations
- **Authentication**: Discord OAuth 2.0

### Architecture Diagram

```text
[Discord] <--OAuth--> [Web Frontend] <--REST API--> [Node.js Backend] <--Drizzle ORM--> [PostgreSQL]
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (e.g., Neon, Railway, Supabase)

### Installation

1. **Clone the repository**
2. **Setup environment variables**
   - Copy `bot/.env.example` to `bot/.env` and fill in Discord and database credentials
   - Copy `web/.env.example` to `web/.env` and fill in web OAuth and database credentials
3. **Install dependencies**
   - `cd bot && npm install`
   - `cd ../web && npm install`
4. **Database setup**
   - Run migrations and seed scripts in `src/database/` using `ts-node`
   - Example: `npx ts-node src/database/seed.ts`
5. **Build and run**
   - Bot: `npm run build` (in `bot/`), then `npm start` or `node build.js`
   - Web: `npm run build` (in `web/`), then `npm run dev` for development

---

### Full Project Structure

```text
root/
├── bot/
│   ├── src/
│   │   ├── database/           # Bot-specific database code
│   │   │   ├── connection.ts   # Bot database connection
│   │   │   ├── init.ts         # Bot database initialization
│   │   │   └── migrations/     # Bot-specific migrations
│   │   └── ...
│   └── data/                   # Bot database files
│       └── bot.db
├── web/
│   ├── server/
│   │   ├── db.ts              # Web database connection
│   │   └── ...
│   ├── shared/
│   │   └── schema.ts          # Shared type definitions
│   └── data/                  # Web database files (if separate)
│       └── web.db
└── shared/                    # NEW: Shared database utilities
│    ├── database/
│    │   ├── schema/
│    │   │   ├── core.sql       # Core shared schema
│    │   │   ├── users.sql      # User management tables
│    │   │   └── game.sql       # Game-specific tables
│    │   ├── seeds/
│    │   │   ├── core-data.sql
│    │   │   └── game-data.sql
│    │   ├── utils/
│    │   │   ├── connection.ts  # Shared connection utilities
│    │   │   ├── migration.ts   # Migration runner utilities
│    │   │   └── validator.ts   # Data validation utilities
│    │   └── types/
│    │       └── database.ts    # Shared database types
│    └── package.json           # Shared dependencies
├── .github/     # Project documentation and instructions
├── ENVIRONMENT_SETUP.md
├── package.json
└── ...
```

---

## Key Features

- Discord RPG bot with character collection, battles, and guild wars
- Modern web dashboard for user management and visualization
- Forum and leaderboard functionality
- Secure Discord OAuth authentication
- Modular, scalable architecture
- Schema-first database migrations
- Automated testing for both bot and web

---

## Development Workflow

- **Branching:** Standard feature-branch workflow
- **Build/Test:** Always run `npm install` after pulling new code or changing dependencies
- **Validation:** Run all tests (`npm test` in both `bot/` and `web/`) and lint (`npm run lint`) before submitting changes
- **CI/CD:** Local tests and builds must pass before pushing; GitHub Actions may be configured
- **Troubleshooting:** Clean `node_modules` and build folders if builds fail; check `.env` files and Node version

---

## Coding Standards

- Use TypeScript for all new code
- Functional programming principles where possible
- Interfaces for data structures and type definitions
- Prefer immutable data (`const`, `readonly`)
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- React: functional components with hooks, CSS modules, small focused components
- Documentation: clear, concise, with code examples and JSDoc for complex functions

---

## Testing

- **Bot:** Jest for unit and integration tests (`bot/test/`)
- **Web:** Vitest for frontend tests (`web/client/pages/*.test.tsx`)
- **Validation:** Run all tests before submitting changes; ensure bot and web dashboard start locally

---

### How to Contribute

- Follow coding standards and project structure
- Reference code exemplars and onboarding instructions in `.github/copilot-instructions.md`
- Submit pull requests with clear descriptions
- Ensure all tests and builds pass before requesting review

---

## License

This project is licensed under the MIT License. See the `web/package.json` for details.

---

For more details, see:

- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [.github/copilot-instructions.md](./.github/copilot-instructions.md)
- [web/README.md](./web/README.md)
