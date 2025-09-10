# Nexium RPG Status System - Railway Deployment

This status monitoring system is designed for `nexium-rpg.win` and integrates with Railway's PostgreSQL database.

## Railway Configuration

### Environment Variables

Set these in your Railway project environment:

```bash
# Optional: Custom monitoring settings
STATUS_CHECK_INTERVAL=30000    # Status check interval in milliseconds (30 seconds)
UPTIME_HISTORY_LIMIT=100       # Number of historical entries to keep per service
NODE_ENV=production            # Set to production for Railway deployment
PORT=5000                      # Railway will override this with $PORT
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

### 1. Website
- **Endpoint**: `https://nexium-rpg.win`
- **Checks**: HTTP HEAD request to main domain
- **Status**: Operational when HTTP 200 response

### 2. API
- **Endpoint**: `https://nexium-rpg.win/api`
- **Checks**: API responsiveness via status endpoint
- **Status**: Operational when API server responds

### 3. Discord Bot
- **Endpoint**: Discord Service
- **Checks**: Service availability (simplified check)
- **Status**: Operational when bot service is running

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

## Status Page Features

- ✅ **Real-time Monitoring**: Auto-refresh every 30 seconds
- ✅ **Service Health Cards**: Individual status for each service
- ✅ **Uptime Percentages**: Historical uptime calculations
- ✅ **Response Times**: Performance monitoring
- ✅ **Service URLs**: Direct links to monitored endpoints
- ✅ **Railway Integration**: Native service monitoring

## Troubleshooting

### Bot Status Shows Down
- Check if bot is deployed and running on Railway
- Check bot logs: `railway logs --service bot`

### Website Status Issues
- Verify `nexium-rpg.win` DNS resolution
- Check Railway web service status
- Review web service logs: `railway logs --service web`
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
- Web service availability via domain check
- API responsiveness and health
- Bot service operational status

All monitoring adapts to Railway's infrastructure automatically.
