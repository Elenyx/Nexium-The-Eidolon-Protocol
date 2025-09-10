# Railway Deployment Guide - Nexium Status System

## Quick Fix for Build Issues

### 1. Web Service Build Problem (SOLVED)

**Issue**: `vite: not found` during build
**Solution**: Updated Dockerfile to install all dependencies before build, then prune dev dependencies after build.

### 2. Railway Environment Setup

**Web Service Configuration**:
```bash
# Railway Environment Variables
NODE_ENV=production
DATABASE_URL=postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway
STATUS_CHECK_INTERVAL=30000
```

**Build Settings**:
- Root Directory: `/web`
- Build Command: `npm run build`
- Start Command: `npm start`

### 3. Bot Service Configuration

**Railway Environment Variables**:
```bash
# Bot specific variables
NODE_ENV=production
DATABASE_URL=postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway
DISCORD_TOKEN=your_discord_token
```

**Build Settings**:
- Root Directory: `/bot`  
- Build Command: `npm run build`
- Start Command: `node build.js`

## Status Monitoring After Deployment

Once both services are deployed on Railway:

1. **Web Status**: https://nexium-rpg.win/status
2. **API Health**: https://nexium-rpg.win/api/status
3. **Database**: Will show operational once connected
4. **Bot**: Will show operational when users interact with bot

## Monitoring Intervals

- **Frontend refresh**: Every 30 seconds
- **Backend health checks**: Every 30 seconds  
- **History retention**: Last 100 checks per service

## Post-Deployment Checklist

- [ ] Web service builds successfully
- [ ] Bot service builds successfully  
- [ ] Database connection established
- [ ] Status page accessible at nexium-rpg.win/status
- [ ] All four services showing in status dashboard
- [ ] Uptime tracking working correctly

## Railway Logs Commands

```bash
# Check web service logs
railway logs --service web

# Check bot service logs  
railway logs --service bot

# Check database status
railway status
```
