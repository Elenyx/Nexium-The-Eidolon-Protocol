# Nexium RPG Status System - Railway Deployment

This status monitoring system is designed for `nexium-rpg.win` and integrates with Railway's PostgreSQL database.

## Railway Configuration

### Environment Variables

Set these in your Railway project environment:

```bash
# Database (automatically provided by Railway)
DATABASE_URL=postgresql://postgres:UrzpIxgDoFWRnMVkgbdUMaYvXZkyGLCD@trolley.proxy.rlwy.net:52172/railway

# Optional: Custom monitoring settings
STATUS_CHECK_INTERVAL=30000
UPTIME_HISTORY_LIMIT=100
```

### Deployment Settings

For **Web Service** deployment on Railway:

- **Root Directory**: `/web`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: Uses `$PORT` environment variable (Railway managed)

For **Bot Service** deployment on Railway:

- **Root Directory**: `/bot`
- **Build Command**: `npm run build`
- **Start Command**: `node build.js`

## Services Monitored

### 1. Railway PostgreSQL
- **Endpoint**: `postgresql://trolley.proxy.rlwy.net:52172`
- **Checks**: Database connectivity and response time
- **Status**: Operational when connection succeeds

### 2. Nexium Website
- **Endpoint**: `https://nexium-rpg.win`
- **Checks**: HTTP HEAD request to main domain
- **Status**: Operational when HTTP 200 response

### 3. Discord Bot
- **Endpoint**: Internal service check
- **Checks**: Recent user activity in database (last hour)
- **Status**: Operational when users have recent daily activities

### 4. Web API
- **Endpoint**: `https://nexium-rpg.win/api`
- **Checks**: API responsiveness
- **Status**: Operational when API server responds

## Access Points

- **Production Status Page**: `https://nexium-rpg.win/status`
- **Local Development**: `http://localhost:5000/status`
- **API Endpoints**:
  - `GET /api/status` - Current system status
  - `GET /api/status/uptime` - Uptime statistics
  - `GET /api/status/history/:service` - Service history

## Local Development with Uptime Kuma

Run Uptime Kuma locally for additional monitoring:

```bash
# From web directory
docker-compose up -d

# Access Uptime Kuma at http://localhost:3001
```

### Uptime Kuma Monitor Configuration

Add these monitors in Uptime Kuma:

1. **Nexium Website**
   - Type: HTTP(s)
   - URL: `https://nexium-rpg.win`
   - Interval: 60 seconds

2. **Status API**
   - Type: HTTP(s) 
   - URL: `https://nexium-rpg.win/api/status`
   - Interval: 60 seconds

3. **Database**
   - Type: PostgreSQL
   - Host: `trolley.proxy.rlwy.net`
   - Port: `52172`
   - Database: `railway`
   - Username: `postgres`
   - Password: `[Railway provided]`

## Status Page Features

- ✅ **Real-time Monitoring**: Auto-refresh every 30 seconds
- ✅ **Service Health Cards**: Individual status for each service
- ✅ **Uptime Percentages**: Historical uptime calculations
- ✅ **Response Times**: Performance monitoring
- ✅ **Service URLs**: Direct links to monitored endpoints
- ✅ **Railway Integration**: Native PostgreSQL monitoring

## Troubleshooting

### Database Connection Issues
```bash
# Check Railway database status
railway status

# Test database connection
railway run psql $DATABASE_URL -c "SELECT 1;"
```

### Bot Status Shows Down
- Check if bot is deployed and running on Railway
- Verify users have recent activity (`last_daily` within 1 hour)
- Check bot logs: `railway logs --service bot`

### Website Status Issues
- Verify `nexium-rpg.win` DNS resolution
- Check Railway web service status
- Review web service logs: `railway logs --service web`

## Production Considerations

1. **Persistent Storage**: Status history is in-memory. For production persistence, implement database storage.

2. **Railway Monitoring**: 
   - Use Railway's built-in metrics alongside this status page
   - Set up Railway notifications for service alerts

3. **External Monitoring**:
   - Consider external monitoring services for redundancy
   - Set up alerts for critical service failures

4. **Performance**:
   - Status checks run every 30 seconds
   - History limited to last 100 entries per service
   - Consider caching for high-traffic scenarios

## Integration with Railway Services

The status system automatically detects and monitors:
- Railway PostgreSQL database health
- Web service availability via domain check
- Bot service activity via database queries
- API responsiveness

All monitoring adapts to Railway's infrastructure automatically.
