# Environment Variables Setup Guide

This guide explains how to set up environment variables for both the Discord bot and web application.

## Discord Application Setup

Before setting up environment variables, you need to create a Discord application:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Nexium RPG")
4. Go to the "Bot" section and create a bot
5. Go to the "OAuth2" section and set up authentication

## Bot Environment Variables (.env)

Copy `bot/.env.example` to `bot/.env` and fill in the values:

```bash
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Environment
NODE_ENV=development
```

### How to Get Bot Values

1. **DISCORD_TOKEN**: In Discord Developer Portal → Bot → Token → Copy
2. **DISCORD_CLIENT_ID**: In Discord Developer Portal → General Information → Application ID
3. **DATABASE_URL**: Create a PostgreSQL database (e.g., on Railway, Neon, or Supabase)

## Web Application Environment Variables (.env)

Copy `web/.env.example` to `web/.env` and fill in the values:

```bash
# Discord OAuth2 Configuration
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:5000/api/auth/discord/callback

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
PORT=5000
NODE_ENV=development
```

### How to Get Web Values

1. **DISCORD_CLIENT_ID**: Same as bot (Application ID from Discord Developer Portal)
2. **DISCORD_CLIENT_SECRET**: Discord Developer Portal → OAuth2 → Client Secret → Copy
3. **DISCORD_REDIRECT_URI**:
   - **Local Development**: `http://localhost:5000/api/auth/discord/callback`
   - **Railway**: `https://your-app-name.railway.app/api/auth/discord/callback`
   - **Netlify**: `https://your-site-name.netlify.app/api/auth/discord/callback`
   - **Custom Domain**: `https://yourdomain.com/api/auth/discord/callback` (e.g., `https://nexium-rpg.win/api/auth/discord/callback`)
4. **DATABASE_URL**: Same PostgreSQL connection string as the bot

## Discord OAuth2 Setup

In Discord Developer Portal → OAuth2 → General:

1. **Redirects**: Add your redirect URI (e.g., `https://nexium-rpg.win/api/auth/discord/callback`)
2. **Scopes**: Make sure you have `bot` and `applications.commands` scopes

## Database Setup

### Option 1: Neon (Recommended)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Use it as `DATABASE_URL`

### Option 2: Railway

1. Create a PostgreSQL database in Railway
2. Copy the connection string
3. Use it as `DATABASE_URL`

### Option 3: Supabase

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the connection string
5. Use it as `DATABASE_URL`

## Deployment Environment Variables

### Railway Deployment

When deploying to Railway, set these environment variables in your Railway project settings:

**For Bot:**

- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- `DATABASE_URL`
- `NODE_ENV=production`

**For Web:**

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI` (your Railway domain + `/api/auth/discord/callback`)
- `DATABASE_URL`
- `NODE_ENV=production`
- `PORT=5000`

### Netlify Deployment (Web Only)

For Netlify, set environment variables in Site Settings → Environment variables:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI` (your Netlify domain + `/api/auth/discord/callback`)
- `DATABASE_URL`
- `NODE_ENV=production`

## Security Notes

- Never commit `.env` files to version control
- Use different Discord applications for development and production
- Keep your Discord bot token and client secret secure
- Regularly rotate your tokens and secrets

## Testing

After setting up environment variables:

1. **Bot**: Run `npm run dev` in the `bot/` directory
2. **Web**: Run `npm run dev` in the `web/` directory

Both should start without errors if environment variables are configured correctly.
