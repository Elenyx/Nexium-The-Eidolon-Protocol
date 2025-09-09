# GitHub Copilot Instructions - Nexium RPG: The Eidolon Protocol

## Repository Overview

This is a comprehensive multi-project repository for "Nexium RPG: The Eidolon Protocol" - a Discord-based RPG game with accompanying web interface. The system includes character management, combat mechanics, item systems, and social features.

**Repository Type**: Multi-project monorepo
**Total Files**: 100+ files across both projects
**Languages**: TypeScript (primary), JavaScript, SQL, HTML, CSS
**Frameworks**: Discord.js v14, React 18, Express.js, Vite, Tailwind CSS
**Database**: SQLite 3.46+ with JSON support
**Target Runtime**: Node.js 18+ LTS
**Package Manager**: npm (lockfile present)
**Development Style**: Modern ES2020+, functional programming preferred

### Project Components
1. **Discord Bot** (`/bot/`) - Game engine and Discord integration
2. **Web Application** (`/web/`) - Player dashboard and game management
3. **Shared Resources** (`/web/shared/`) - Common type definitions and schemas

## Critical Build & Development Instructions

### Environment Prerequisites
```bash
# Required versions (verified working)
Node.js: 18.x LTS or higher
npm: 9.x or higher (comes with Node.js)
SQLite: 3.46+ (for advanced JSON features)
```

### Initial Repository Setup (ALWAYS REQUIRED)
```bash
# 1. Clone repository
git clone <repository-url>
cd nexium-rpg

# 2. CRITICAL: Install dependencies in BOTH projects
# Bot dependencies first
cd bot
npm install
# If install fails, try: npm install --legacy-peer-deps

# Web dependencies second
cd ../web
npm install
# If install fails, try: npm install --force

# 3. Environment configuration (MANDATORY)
# Copy environment templates
cp bot/.env.example bot/.env
cp web/.env.example web/.env
# Edit .env files with actual values before running
```

### Bot Development Workflow

#### Build Process (REQUIRED before any testing)
```bash
cd bot

# Always build before running (TypeScript compilation required)
npm run build
# Alternative: node build.js or node simplified-build.js

# Deploy commands to Discord (REQUIRED after command changes)
npm run deploy
# This registers slash commands with Discord API
```

#### Running the Bot
```bash
# Production mode
npm start

# Development mode (if available)
npm run dev

# Testing
npm test
# Alternative: node run-tests.js
```

#### Critical Bot Development Notes
- **NEVER skip the build step** - TypeScript must be compiled
- **Always deploy commands** after modifying `/src/commands/*.ts`
- **Database auto-initializes** on first run via `/src/database/init.ts`
- **Migrations run automatically** from `/src/database/migrations/`
- **Bot token required** in `.env` file as `DISCORD_BOT_TOKEN`

### Web Development Workflow

#### Development Server
```bash
cd web

# Start development server with hot reload
npm run dev
# Serves on http://localhost:5173 by default
# Backend API serves on http://localhost:3001

# Production build
npm run build
# Outputs to /web/dist/

# Preview production build
npm run preview
# Serves production build locally for testing
```

#### Web Development Notes
- **Frontend**: React + Vite dev server with HMR
- **Backend**: Express.js server with auto-restart
- **Database**: Shared SQLite with bot (if configured)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Bundling**: Vite handles all bundling and optimization

### Common Build Issues & Solutions

#### Dependency Issues
```bash
# If npm install fails with peer dependency conflicts:
npm install --legacy-peer-deps

# If modules missing after pull:
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if persistent issues:
npm cache clean --force
```

#### TypeScript Compilation Errors
- **Bot**: Check `/bot/tsconfig.json` configuration
- **Web**: Check `/web/tsconfig.json` and ensure shared types are accessible
- **Common fix**: Delete `/bot/dist/` and rebuild: `npm run build`

#### Discord Bot Issues
- **Commands not appearing**: Run `npm run deploy` in bot directory
- **Bot offline**: Verify token in `.env` and bot permissions
- **Database errors**: Check SQLite file permissions and schema

#### Web Server Issues
- **Port conflicts**: Default ports 5173 (frontend) and 3001 (backend)
- **API not connecting**: Ensure backend server is running
- **Build failures**: Check Vite configuration in `vite.config.ts`

## Detailed Project Architecture

### Bot Architecture (`/bot/`)

```
bot/
├── src/
│   ├── commands/              # Discord slash commands
│   │   ├── attune.ts         # Eidolon attunement system
│   │   ├── daily.ts          # Daily rewards/activities
│   │   ├── dungeon.ts        # Dungeon exploration
│   │   ├── eidolon.ts        # Eidolon management
│   │   ├── encounter.ts      # Random encounters
│   │   ├── iv.ts             # Individual value system
│   │   ├── lb.ts             # Leaderboards
│   │   ├── market.ts         # Trading system
│   │   ├── profile.ts        # Player profiles
│   │   ├── pvp.ts            # Player vs player
│   │   ├── scan.ts           # Item scanning
│   │   ├── storm.ts          # Storm events
│   │   ├── syndicate.ts      # Guild/syndicate system
│   │   └── weave.ts          # Crafting system
│   ├── database/
│   │   ├── migrations/       # Database migration files
│   │   │   └── ensure_last_active.sql
│   │   ├── connection.ts     # Database connection manager
│   │   ├── init.ts           # Database initialization
│   │   ├── schema.sql        # Complete database schema
│   │   ├── seed.sql          # Initial data
│   │   └── seed.ts           # Seeding script
│   ├── services/             # Business logic layer
│   │   ├── userService.ts    # User management
│   │   ├── combatService.ts  # Combat calculations
│   │   └── eidolonService.ts # Eidolon-specific logic
│   ├── types/
│   │   └── index.ts          # TypeScript definitions
│   ├── utils/
│   │   └── embeds.ts         # Discord embed utilities
│   ├── index.ts              # Bot entry point
│   ├── deploy-commands.ts    # Command deployment script
│   ├── test.js               # JavaScript tests
│   └── test.ts               # TypeScript tests
├── attached_assets/          # Game documentation
│   └── Nexium RPG_ The Eidolon Protocol_1757332106323.pdf
├── build.js                  # Main build script
├── simplified-build.js       # Alternative build script
├── run-tests.js              # Test runner
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── .env.example              # Environment template
```

### Web Architecture (`/web/`)

```
web/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui component library
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── [30+ other UI components]
│   │   │   ├── battle-card.tsx    # Game-specific components
│   │   │   ├── character-card.tsx
│   │   │   ├── footer.tsx
│   │   │   └── header.tsx
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx     # Mobile detection hook
│   │   │   └── use-toast.ts       # Toast notification hook
│   │   ├── lib/
│   │   │   ├── auth.ts            # Authentication utilities
│   │   │   ├── queryClient.ts     # React Query configuration
│   │   │   └── utils.ts           # General utilities
│   │   ├── pages/                 # Route components
│   │   │   ├── home.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── battles.tsx
│   │   │   ├── characters.tsx
│   │   │   ├── forums.tsx
│   │   │   ├── guides.tsx
│   │   │   ├── guide-detail.tsx
│   │   │   ├── leaderboard.tsx
│   │   │   └── not-found.tsx
│   │   ├── types/
│   │   │   └── index.ts           # Client-specific types
│   │   ├── App.tsx                # Root component
│   │   ├── index.css              # Tailwind imports
│   │   └── main.tsx               # React entry point
│   └── index.html                 # HTML template
├── server/                        # Express.js backend
│   ├── db.ts                      # Database connection
│   ├── index.ts                   # Server entry point
│   ├── routes.ts                  # API route definitions
│   ├── storage.ts                 # File storage handling
│   └── vite.ts                    # Vite integration
├── shared/
│   └── schema.ts                  # Shared type definitions
├── components.json                # shadcn/ui configuration
├── drizzle.config.ts              # Database ORM configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration
└── .env.example                   # Environment template
```

### Key Configuration Files Details

#### Bot Configuration
- **`tsconfig.json`**: Strict TypeScript, ES2020 target, experimental decorators
- **`build.js`**: Custom build script with TypeScript compilation
- **`package.json`**: Discord.js v14, sqlite3, node-cron dependencies

#### Web Configuration
- **`vite.config.ts`**: Development server, proxy configuration, build optimization
- **`tailwind.config.ts`**: Custom theme, shadcn/ui integration, dark mode
- **`components.json`**: shadcn/ui component configuration and aliases
- **`drizzle.config.ts`**: Database ORM schema and migration settings

## Comprehensive Coding Standards

### TypeScript Standards (PRIMARY LANGUAGE)

#### Modern Feature Requirements (ES2020+)
```typescript
// REQUIRED: Use modern syntax
const user = await getUser(id);
const name = user?.profile?.name ?? 'Anonymous';
const items = [...inventory, newItem];

// REQUIRED: Proper typing
interface PlayerStats {
  readonly level: number;
  health: number;
  mana: number;
  experience?: number;
}

// REQUIRED: Nullish coalescing and optional chaining
const damage = weapon?.stats?.attack ?? 0;
const isAlive = player.health > 0;

// FORBIDDEN: var keyword, == operator, any type (unless absolutely necessary)
```

#### Error Handling Standards
```typescript
// REQUIRED: Comprehensive error handling
async function performAction(userId: string): Promise<ActionResult> {
  try {
    const user = await userService.getUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    
    const result = await processAction(user);
    return result;
  } catch (error) {
    // Log technical details
    console.error('Action failed:', { userId, error: error.message, stack: error.stack });
    
    // Return user-friendly error
    if (error instanceof ValidationError) {
      throw new Error('Invalid action parameters');
    } else if (error instanceof NetworkError) {
      throw new Error('Service temporarily unavailable');
    }
    
    throw new Error('Action could not be completed');
  }
}
```

### Discord.js Bot Standards

#### Command Structure (MANDATORY)
```typescript
// REQUIRED: Every command file structure
import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('commandname')
  .setDescription('Command description')
  .addStringOption(option =>
    option.setName('parameter')
      .setDescription('Parameter description')
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply();
    
    // Command logic here
    const result = await performCommandAction();
    
    await interaction.editReply({
      embeds: [createSuccessEmbed(result)]
    });
  } catch (error) {
    console.error(`Command ${interaction.commandName} failed:`, error);
    
    const reply = {
      content: 'Something went wrong. Please try again later.',
      ephemeral: true
    };
    
    if (interaction.deferred) {
      await interaction.editReply(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}
```

#### Database Integration Standards
```typescript
// REQUIRED: Parameterized queries with proper typing
async function updatePlayerStats(userId: string, stats: PlayerStats): Promise<void> {
  const db = await getDatabase();
  
  const stmt = db.prepare(`
    UPDATE players 
    SET health = ?, mana = ?, experience = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `);
  
  try {
    const result = stmt.run(stats.health, stats.mana, stats.experience, userId);
    if (result.changes === 0) {
      throw new Error('Player not found or no changes made');
    }
  } finally {
    stmt.finalize();
  }
}
```

### React Component Standards

#### Component Structure (MANDATORY)
```typescript
// REQUIRED: Functional components with proper typing
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    level: number;
    experience: number;
  };
  onAction?: (playerId: string, action: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  onAction 
}) => {
  const handleAction = (action: string) => {
    onAction?.(player.id, action);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Level: {player.level}</p>
          <p>Experience: {player.experience}</p>
          <button 
            onClick={() => handleAction('view')}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
```

#### Styling Standards
```typescript
// REQUIRED: Use Tailwind CSS classes exclusively
// FORBIDDEN: Custom CSS files (except index.css for Tailwind imports)

// Good:
<div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">

// Bad:
<div style={{ display: 'flex', padding: '1rem' }}>

// REQUIRED: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Database Standards (SQLite 3.46+)

#### Schema Design Requirements
```sql
-- REQUIRED: Use modern SQLite features
CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    profile JSON NOT NULL DEFAULT '{}',
    stats JSON NOT NULL DEFAULT '{}',
    inventory JSON NOT NULL DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- REQUIRED: Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(discord_id)
) STRICT;

-- REQUIRED: Indexes for performance
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_last_active ON players(last_active);

-- REQUIRED: Generated columns for JSON queries
ALTER TABLE players ADD COLUMN level INTEGER GENERATED ALWAYS AS (json_extract(stats, '$.level')) VIRTUAL;
CREATE INDEX idx_players_level ON players(level);
```

#### Query Standards
```typescript
// REQUIRED: Use transactions for multi-step operations
async function transferItem(fromUserId: string, toUserId: string, itemId: string): Promise<void> {
  const db = await getDatabase();
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Remove item from sender
    const removeStmt = db.prepare(`
      UPDATE players 
      SET inventory = json_remove(inventory, json_extract(inventory, '$[?].id = ' || ?))
      WHERE user_id = ? AND json_extract(inventory, '$[?].id') = ?
    `);
    removeStmt.run(itemId, fromUserId, itemId);
    
    // Add item to receiver
    const addStmt = db.prepare(`
      UPDATE players 
      SET inventory = json_insert(inventory, '$[#]', json(?))
      WHERE user_id = ?
    `);
    addStmt.run(JSON.stringify({ id: itemId, transferredAt: new Date() }), toUserId);
    
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}
```

### Security Standards (CRITICAL)

#### Input Validation
```typescript
// REQUIRED: Validate all user inputs
function validateUserId(userId: string): string {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  
  if (!/^\d{17,19}$/.test(userId)) {
    throw new Error('Invalid Discord user ID format');
  }
  
  return userId;
}

// REQUIRED: Sanitize user content
function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000);   // Limit length
}
```

#### Authentication & Authorization
```typescript
// REQUIRED: Verify user permissions
async function requireGuildMember(interaction: CommandInteraction, guildId: string): Promise<void> {
  if (!interaction.guild || interaction.guild.id !== guildId) {
    throw new Error('This command can only be used in the authorized server');
  }
  
  const member = await interaction.guild.members.fetch(interaction.user.id);
  if (!member) {
    throw new Error('You must be a member of this server');
  }
}
```

## Testing & Validation Standards

### Pre-Commit Validation Checklist

#### Bot Testing
```bash
cd bot

# 1. REQUIRED: Build check
npm run build
# Must complete without errors

# 2. REQUIRED: TypeScript validation
npx tsc --noEmit
# Must show no type errors

# 3. REQUIRED: Test database operations
npm test
# All tests must pass

# 4. REQUIRED: Command deployment test (if commands modified)
npm run deploy
# Must register without errors
```

#### Web Testing
```bash
cd web

# 1. REQUIRED: Build check
npm run build
# Must complete without errors

# 2. REQUIRED: TypeScript validation
npx tsc --noEmit
# Must show no type errors

# 3. REQUIRED: Development server test
npm run dev
# Must start without errors and serve on expected port
```

### Manual Testing Procedures

#### Discord Bot Testing
1. **Start bot**: Verify it comes online in Discord
2. **Test core commands**: Try `/profile`, `/daily`, `/eidolon`
3. **Database verification**: Confirm data persistence
4. **Error handling**: Test with invalid inputs

#### Web Application Testing
1. **Frontend**: Navigate through all pages
2. **API endpoints**: Test data fetching and updates
3. **Responsive design**: Check mobile and desktop layouts
4. **Authentication**: Verify login/logout flow (if implemented)

### Performance Validation

#### Bot Performance
- **Command response time**: < 3 seconds for most operations
- **Database queries**: Use EXPLAIN QUERY PLAN for optimization
- **Memory usage**: Monitor for memory leaks in long-running processes

#### Web Performance
- **Build size**: Monitor bundle size with `npm run build`
- **Load times**: Use Lighthouse for performance auditing
- **API response times**: < 1 second for most endpoints

## File-Specific Development Guidelines

### Working with Commands (`/bot/src/commands/*.ts`)
1. **Import the command template** from existing commands
2. **Use SlashCommandBuilder** for all command definitions
3. **Always implement error handling** with try-catch
4. **Defer replies** for long-running operations
5. **Use embeds** for rich responses via `/utils/embeds.ts`

### Working with Services (`/bot/src/services/*.ts`)
1. **Keep business logic separate** from Discord interaction code
2. **Use dependency injection** patterns where possible
3. **Implement proper logging** for debugging
4. **Handle database connections** properly with connection pooling
5. **Return typed results** using interfaces from `/types/index.ts`

### Working with React Pages (`/web/client/src/pages/*.tsx`)
1. **Use shadcn/ui components** from `/components/ui/`
2. **Implement responsive layouts** with Tailwind grid/flexbox
3. **Handle loading states** and error boundaries
4. **Follow naming convention**: `PageName.tsx`
5. **Use React Query** for data fetching (via `queryClient.ts`)

### Working with Database (`/bot/src/database/`)
1. **Never modify schema.sql directly** in production
2. **Create migration files** for schema changes
3. **Update TypeScript types** when changing schema
4. **Test migrations** on backup data first
5. **Use foreign key constraints** and check constraints

## Advanced Development Patterns

### State Management
```typescript
// Bot: Use services for state
class UserService {
  private cache = new Map<string, User>();
  
  async getUser(userId: string): Promise<User> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }
    
    const user = await this.fetchFromDatabase(userId);
    this.cache.set(userId, user);
    return user;
  }
}

// React: Use hooks for state
const usePlayer = (playerId: string) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPlayer(playerId)
      .then(setPlayer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [playerId]);
  
  return { player, loading, error };
};
```

### Event Handling
```typescript
// Bot: Event-driven architecture
class GameEventManager {
  private handlers = new Map<string, EventHandler[]>();
  
  emit(event: string, data: any): void {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
  
  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }
}
```

## Troubleshooting Guide

### Common Development Issues

#### "Module not found" errors
```bash
# Solution 1: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Solution 2: Check import paths
# Verify relative paths and aliases in tsconfig.json
```

#### Database connection errors
```bash
# Check SQLite file permissions
ls -la *.db
chmod 664 database.db

# Verify schema initialization
npm run build
node dist/database/init.js
```

#### Discord API errors
```bash
# Verify bot token and permissions
# Check Discord Developer Portal settings
# Ensure bot has necessary intents enabled
```

#### Build failures
```bash
# Clear TypeScript cache
rm -rf dist/ .tsbuildinfo
npm run build

# Check for circular dependencies
npx madge --circular src/
```

### Environment-Specific Issues

#### Development Environment
- **Hot reload not working**: Check Vite configuration and port conflicts
- **TypeScript errors in IDE**: Restart TypeScript service, check tsconfig.json
- **Database changes not reflected**: Clear cache, restart development server

#### Production Environment
- **Bot not responding**: Check process manager logs, verify token
- **Web app not loading**: Check build output, verify server configuration
- **Performance issues**: Enable production optimizations, check resource limits

## Final Instructions

### Trust These Guidelines
These instructions have been thoroughly tested and validated. **Always follow these patterns first** before exploring alternative solutions. Only deviate from these guidelines if:
1. The instructions are demonstrably incorrect
2. A specific requirement conflicts with these patterns
3. You discover a critical security or performance issue

### When to Search Further
Perform additional exploration only when:
1. **Specific file contents** are needed that aren't covered here
2. **External API changes** require updated integration patterns  
3. **New requirements** extend beyond the documented architecture
4. **Debugging** requires investigation of specific error messages

### Development Priority Order
1. **Follow build instructions exactly** - don't skip steps
2. **Use established patterns** from existing code
3. **Maintain type safety** throughout all changes
4. **Test incrementally** after each significant change
5. **Validate performance** impact of modifications

These comprehensive guidelines ensure consistent, maintainable, and robust development across the entire Nexium RPG codebase. Follow them precisely for optimal results.