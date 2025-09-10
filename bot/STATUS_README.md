# Bot Status Monitoring

This document explains how the bot integrates with the status monitoring system.

## Status Integration

The Discord bot status is monitored by checking for recent user activity in the database. The web status page monitors the bot by:

1. Querying for users with `last_daily` activity within the last hour
2. If users have recent activity, the bot is considered operational
3. If no recent activity, the bot is marked as degraded
4. If the query fails, the bot is marked as down

## Local Development with Uptime Kuma

```bash
# From bot directory
docker-compose up -d

# Access Uptime Kuma at http://localhost:3002
```

## Railway Deployment

The bot runs as a separate service on Railway:

- **Root Directory**: `/bot`
- **Build Command**: `npm run build`
- **Start Command**: `node build.js`

## Health Monitoring

The bot's health is monitored indirectly through:
- Database connectivity (shared with web service)
- User activity patterns (daily command usage)
- Error rates (via Railway logs)

For direct monitoring, you can add a health endpoint to the bot service.
