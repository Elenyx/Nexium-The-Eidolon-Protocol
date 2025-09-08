# Nexium RPG: The Eidolon Protocol

A sophisticated Discord RPG bot built with Node.js, TypeScript, and Discord.js Components V2, featuring puzzle-based combat, collectible Eidolons, and a player-driven economy.

## Overview

Nexium RPG transforms Discord servers into immersive urban science-fantasy worlds where players become "Weavers" who stabilize spectral entities called Eidolons through strategic puzzle combat and narrative integration.

## Key Features

### Core Systems
- **Eidolon Collection**: Collectible spectral entities with rarity levels (C, UC, R, SR, SSR)
- **Puzzle Combat**: `/scan` and `/weave` commands requiring logical pattern solving
- **Dual Economy**: NEX (soulbound) and CRD (tradable) currencies
- **Sync Ratios**: Bond mechanics between players and Eidolons
- **Components V2**: Modern Discord interface with rich layouts

### Current Commands
- `/profile create` - Start your journey as a Weaver
- `/profile view` - View your current profile and stats
- `/encounter` - Start a random combat encounter
- `/scan` - Analyze enemy weaknesses (sends hints via DM)
- `/weave [pattern]` - Execute logical patterns to defeat enemies
- `/attune` - Collect new Eidolons using Tuners
- `/eidolon list` - View your Eidolon collection
- `/eidolon view [id]` - Detailed view of specific Eidolon
- `/eidolon interact [id]` - Strengthen bonds with your Eidolons

## Technical Architecture

### Database Schema (PostgreSQL)
- **users**: Player profiles and progression
- **eidolons**: Master list of collectible entities
- **user_eidolons**: Player's collected Eidolons with bond data
- **encounters**: Combat encounters with puzzle patterns
- **combat_logs**: Player action tracking
- **items**: Equipment and materials (foundation for crafting)

### Project Structure
```
src/
├── commands/           # Slash command implementations
├── services/          # Database and game logic services
├── database/          # Database connection and schema
├── types/            # TypeScript type definitions
├── utils/            # Helper functions and component builders
└── index.ts          # Main bot entry point
```

## Recent Changes
- Implemented Discord Components V2 for rich message layouts
- Created foundational combat system with puzzle mechanics
- Set up PostgreSQL database with core game entities
- Added rotating bot activities (WATCHING/PLAYING status)
- Built comprehensive Eidolon collection and interaction system

## Development Notes

### Components V2 Integration
- Uses `MessageFlags.IsComponentsV2` for modern Discord layouts
- Leverages `TextDisplayBuilder` and `ContainerBuilder` for rich formatting
- Sends combat hints via DM for authentic puzzle experience

### Database Management
- Never manually write SQL migrations
- Use `npm run db:push --force` to sync schema changes
- Environment variables are automatically configured by Replit

### Bot Status Rotation
The bot cycles through immersive activities every 30 seconds:
- "the Eidolon Protocol" (WATCHING)
- "Nexium RPG" (PLAYING)
- "Neo-Avalon frequencies" (LISTENING)
- "data weaving patterns" (WATCHING)
- "with spectral entities" (PLAYING)
- "anomaly reports" (WATCHING)
- "Syndicate communications" (LISTENING)

## Future Roadmap
Based on the original PDF specification:
- Synthesis crafting system with grid-based minigames
- Nexus Vaults (instanced dungeons for 1-4 players)
- Syndicate system (guilds with ward control mechanics)
- Player market and secure trading system
- Nexium Storms (server-wide dynamic events)
- Advanced Eidolon progression and ascension mechanics

## Environment Variables
- `DISCORD_TOKEN`: Bot authentication token
- `DISCORD_CLIENT_ID`: Application client ID
- Database credentials are automatically managed by Replit

## Current Status
✅ Core bot framework operational
✅ Database schema implemented
✅ Basic combat and collection systems working
✅ Components V2 integration complete
✅ Global slash commands registered