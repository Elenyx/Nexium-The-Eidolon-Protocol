# Nexium: The Eidolon Protocol - Coding Agent Instructions

## Repository Overview

**Nexium: The Eidolon Protocol** is a sophisticated Discord RPG bot with a React web application frontend. The repository consists of two main components in a monorepo structure:

- **Bot** (`/bot`): Discord.js TypeScript bot with puzzle-based combat and Eidolon collection mechanics
- **Web** (`/web`): React + TypeScript web application with Express backend for user profiles and forums

**Languages & Frameworks**: TypeScript, Node.js, React 18, Discord.js v14, Express.js, PostgreSQL
**Database**: PostgreSQL with Drizzle ORM (web) and raw queries (bot)
**Build Tools**: Custom TypeScript compiler (bot), Vite + esbuild (web)
**Target Deployment**: Replit (primary), Railway, Netlify

## Critical Build Instructions

### Prerequisites & Environment Setup

**ALWAYS** set up environment variables before any development work:
1. Copy `bot/.env.example` to `bot/.env` 
2. Copy `web/.env.example` to `web/.env`
3. Set `DATABASE_URL` to a valid PostgreSQL connection string (required for both components)
4. For bot: Set `DISCORD_TOKEN` and `DISCORD_CLIENT_ID` 
5. For web: Set `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, and `DISCORD_REDIRECT_URI`

**Environment variable setup is mandatory** - see `ENVIRONMENT_SETUP.md` for detailed instructions.

### Installation & Dependencies

**ALWAYS install dependencies for the specific component you're working on:**

```bash
# For bot development
cd bot && npm install

# For web development  
cd web && npm install

# Root level (shared dependencies)
npm install
```

**Bot has a postinstall build hook** - installation will automatically trigger a build.

### Build Commands (Validated Working Order)

**Bot Component** (`/bot`):
```bash
cd bot
npm install                 # Always run first (includes postinstall build)
npm run build              # Custom TypeScript transpiler (simplified-build.js)
npm run test:unit          # Vitest tests (no test files currently exist)
npm run dev                # Development with tsx watch mode
npm run start              # Production mode (requires .env with DATABASE_URL)
npm run deploy             # Build + deploy Discord commands
```

**Web Component** (`/web`):
```bash
cd web
npm install                # Always run first
npm run check              # TypeScript validation (MUST pass before building)
npm run build              # Vite build (frontend) + esbuild (backend) - ~6-8 seconds
npm run dev                # Development mode with hot reload
npm run start              # Production server
npm run db:push            # Sync Drizzle schema changes to database
```

### Build Validation & Error Handling

**Common Build Issues & Solutions:**

1. **TypeScript Errors in Web**: Always run `npm run check` first. If it fails with missing type definitions:
   - Ensure all dependencies are installed: `npm install`
   - Check that `@types/node` and `vite` are in devDependencies

2. **Bot Build Failures**: The bot uses a custom TypeScript compiler (`simplified-build.js`):
   - If TypeScript compilation fails, it falls back to manual conversion
   - Build artifacts are placed in `/bot/dist`
   - Clean builds: Remove `/bot/dist` directory before rebuilding

3. **Database Connection Errors**: 
   - Ensure `DATABASE_URL` is set in environment variables for both components
   - Use `npm run db:push` in web component to apply schema changes

4. **Large Bundle Warning in Web**: The warning about 500kB+ chunks is expected and normal due to Radix UI components.

**Timing Expectations:**
- Bot build: ~2-3 seconds (TypeScript transpilation)
- Web build: ~6-8 seconds (Vite frontend + esbuild backend)
- Test runs: Bot tests currently have no test files (configured but unused)

## Project Architecture & Layout

### Repository Structure
```
/
├── bot/                    # Discord bot component
│   ├── src/                # TypeScript source files
│   │   ├── commands/       # Discord slash commands
│   │   ├── services/       # Database and game logic
│   │   ├── database/       # Database connection and schema
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Helper functions and component builders
│   │   └── index.ts        # Bot entry point
│   ├── dist/               # Build output (generated)
│   ├── package.json        # Bot dependencies and scripts
│   ├── tsconfig.json       # TypeScript configuration
│   └── simplified-build.js # Custom build script
├── web/                    # Web application component
│   ├── client/             # React frontend source
│   │   └── src/            # React components and pages
│   ├── server/             # Express backend source
│   ├── shared/             # Shared types and database schema
│   │   └── schema.ts       # Drizzle ORM schema definition
│   ├── dist/               # Build output (generated)
│   ├── package.json        # Web dependencies and scripts
│   ├── tsconfig.json       # TypeScript configuration
│   ├── vite.config.ts      # Vite build configuration
│   ├── drizzle.config.ts   # Database migration configuration
│   └── tailwind.config.ts  # Tailwind CSS configuration
├── package.json            # Root shared dependencies
├── ENVIRONMENT_SETUP.md    # Detailed environment variable guide
└── .gitignore              # Excludes node_modules, dist, .env files
```

### Key Configuration Files
- **TypeScript**: Separate configs for bot (ES2022/Node) and web (ESNext/DOM)
- **Database**: Drizzle ORM configuration in `web/drizzle.config.ts`
- **Frontend**: Vite with React, Replit plugins for development
- **Styling**: Tailwind CSS with Radix UI component system
- **Path Aliases**: `@/*` (client src), `@shared/*` (shared types)

### Database Architecture
- **Primary Database**: PostgreSQL (shared between bot and web)
- **Bot Access**: Direct PostgreSQL queries via `pg` package
- **Web Access**: Drizzle ORM with schema-first approach
- **Schema Location**: `web/shared/schema.ts`
- **Migrations**: Use `npm run db:push` in web component

### Discord Integration
- **Bot**: Uses Discord.js v14 with Components V2 for rich message layouts
- **Web**: Discord OAuth2 authentication with session management
- **Commands**: Global slash commands with puzzle-based combat system
- **Features**: Eidolon collection, guild wars, battles, forums

## Validation & Testing Guidelines

**Pre-commit Validation Steps:**
1. **TypeScript Check**: `cd web && npm run check` (must pass)
2. **Build Validation**: `cd bot && npm run build` AND `cd web && npm run build`
3. **Environment Check**: Ensure `.env` files exist and contain required variables

**No Linting Configuration**: Repository does not use ESLint, Prettier, or other linters.

**Testing Strategy**: 
- Bot component has Vitest configured but no test files exist
- Web component uses TypeScript checking as primary validation
- Manual testing recommended for Discord command functionality

## Development Workflow Best Practices

1. **Always work within the specific component directory** (`bot/` or `web/`)
2. **Install dependencies separately** for each component you modify
3. **Run TypeScript checks early** and frequently during development
4. **Use development modes** (`npm run dev`) for hot reloading
5. **Test database connectivity** before making schema changes
6. **Verify Discord token validity** when working on bot commands

## Deployment Notes

- **Primary Target**: Replit (includes Replit-specific Vite plugins)
- **Alternative Deployments**: Railway (full-stack), Netlify (web only)
- **Production Environment**: Set `NODE_ENV=production` in environment variables
- **Database**: External PostgreSQL service required (Neon, Railway, Supabase)

**Trust these instructions first** - only perform additional searches if information is incomplete or errors occur that aren't covered above.