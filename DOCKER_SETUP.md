# Docker Setup Guide

This guide explains how to run the Nexium RPG bot and web application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Node.js 20+ (for local development)

## Project Structure

Each component (bot and web) has its own Docker configuration:

```text
├── bot/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .dockerignore
│   ├── .env.example
│   ├── docker-setup.bat    # Windows setup script
│   └── docker-setup.sh     # Linux/Mac setup script
├── web/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .dockerignore
│   ├── .env.example
│   ├── docker-setup.bat    # Windows setup script
│   └── docker-setup.sh     # Linux/Mac setup script
└── docker-compose.full.yml # Combined setup
```

## Quick Start

### Option 1: Individual Services

#### Bot Only

```bash
cd bot
# Copy and edit environment file
cp .env.example .env
# Edit .env with your Discord credentials

# Run setup script (Windows)
docker-setup.bat

# Or run setup script (Linux/Mac)
chmod +x docker-setup.sh
./docker-setup.sh

# Or manually
docker-compose up -d
```

#### Web Only

```bash
cd web
# Copy and edit environment file
cp .env.example .env
# Edit .env with your configuration

# Run setup script (Windows)
docker-setup.bat

# Or run setup script (Linux/Mac)
chmod +x docker-setup.sh
./docker-setup.sh

# Or manually
docker-compose up -d
```

### Option 2: Combined Services

Run both bot and web together:

```bash
# From project root
docker-compose -f docker-compose.full.yml up -d
```

## Environment Configuration

### Bot Environment Variables (.env)

```bash
# Required
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here

# Database
DATABASE_URL=./data/nexium.db

# Optional
NODE_ENV=production
LOG_LEVEL=info
```

### Web Environment Variables (.env)

```bash
# Application
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=./data/nexium.db

# Optional
BOT_API_URL=http://nexium-bot:3000
LOG_LEVEL=info
```

## Service URLs

- **Web Application**: <http://localhost:5000>
- **Uptime Kuma (Web)**: <http://localhost:3001>
- **Uptime Kuma (Bot)**: <http://localhost:3002> (when running individually)

## Docker Commands

### Build Images

```bash
# Individual services
cd bot && docker-compose build
cd web && docker-compose build

# Combined
docker-compose -f docker-compose.full.yml build
```

### Start Services

```bash
# Individual services
cd bot && docker-compose up -d
cd web && docker-compose up -d

# Combined
docker-compose -f docker-compose.full.yml up -d
```

### Stop Services

```bash
# Individual services
cd bot && docker-compose down
cd web && docker-compose down

# Combined
docker-compose -f docker-compose.full.yml down
```

### View Logs

```bash
# Individual services
cd bot && docker-compose logs -f nexium-bot
cd web && docker-compose logs -f nexium-web

# Combined
docker-compose -f docker-compose.full.yml logs -f
```

### Restart Services

```bash
# Individual services
cd bot && docker-compose restart nexium-bot
cd web && docker-compose restart nexium-web

# Combined
docker-compose -f docker-compose.full.yml restart
```

## Data Persistence

### Volumes

- **Database**: `./data/` directory (SQLite files)
- **Logs**: `./logs/` directory
- **Uptime Kuma**: Docker volume for monitoring data

### Backup

To backup your data:

```bash
# Create backup directory
mkdir backup

# Copy database and logs
cp -r bot/data/ backup/bot-data-$(date +%Y%m%d)
cp -r web/data/ backup/web-data-$(date +%Y%m%d)
cp -r bot/logs/ backup/bot-logs-$(date +%Y%m%d)
cp -r web/logs/ backup/web-logs-$(date +%Y%m%d)
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3001, 3002, and 5000 are available
2. **Permission issues**: Ensure Docker has access to the project directories
3. **Environment variables**: Double-check your .env files are properly configured

### Debug Commands

```bash
# Check running containers
docker ps

# Check logs for specific service
docker-compose logs nexium-bot
docker-compose logs nexium-web

# Access container shell
docker exec -it nexium-discord-bot sh
docker exec -it nexium-web-app sh

# Check container resource usage
docker stats
```

### Health Checks

Both services include health checks:

- **Bot**: Simple Node.js runtime check
- **Web**: HTTP health endpoint check at `/health`

Check health status:

```bash
docker inspect nexium-discord-bot | grep Health
docker inspect nexium-web-app | grep Health
```

## Development vs Production

### Development

- Use individual docker-compose files in each directory
- Mount source code for live reloading (modify volumes in docker-compose.yml)
- Use development environment variables

### Production

- Use the combined docker-compose.full.yml
- Configure proper environment variables
- Set up proper logging and monitoring
- Consider using external databases instead of SQLite

## Security Considerations

- **Environment Variables**: Never commit .env files with real credentials
- **User Permissions**: Services run as non-root users inside containers
- **Network**: Services communicate through isolated Docker networks
- **Volumes**: Data directories have proper permissions

## Updating Services

To update the services:

```bash
# Pull latest code
git pull

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d
```
