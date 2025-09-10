# Nexium Status System

This directory contains the implementation of a status monitoring system similar to Nekos API, providing real-time uptime monitoring and service health checks.

## Features

- **Real-time Status Dashboard**: Live status page showing all service health
- **Service Monitoring**: Monitors Database, API, and Website services
- **Uptime Statistics**: Historical uptime data and response times
- **Auto-refresh**: Status page updates every 30 seconds
- **Responsive Design**: Works on desktop and mobile devices
- **Uptime Kuma Integration**: Optional external monitoring with Uptime Kuma

## Components

### Backend (Server)

- `server/status.ts` - Status API endpoints and service health checks
- `server/uptime-monitor.ts` - Background monitoring service
- Status routes in `server/routes.ts`:
  - `GET /api/status` - Current system status
  - `GET /api/status/history/:service` - Historical data for a service
  - `GET /api/status/uptime` - Uptime statistics

### Frontend (Client)

- `client/src/pages/status.tsx` - Status page component
- Added to navigation in `components/header.tsx`
- Route added to `App.tsx`

## Setup

### 1. Development Mode

The status system is already integrated into your existing web app. Simply start your development server:

```bash
cd web
npm run dev:win
```

Visit `http://localhost:5000/status` to see the status page.

### 2. Production with Docker

Start the complete system including Uptime Kuma:

```bash
# From project root
docker-compose up -d
```

This will start:
- Your web app on `http://localhost:5000`
- Uptime Kuma on `http://localhost:3001`
- PostgreSQL database on `localhost:5432`

### 3. Uptime Kuma Configuration

After starting with Docker Compose:

1. Visit `http://localhost:3001`
2. Set up your admin account
3. Add monitors for your services:
   - **Nexium Web API**: `http://nexium-web:5000/api/status`
   - **Nexium Status Page**: `http://nexium-web:5000/status`
   - **Database**: PostgreSQL monitor for `nexium-postgres:5432`

## Service Monitoring

The system monitors:

### Database
- Tests database connectivity with a simple query
- Measures response time
- Reports operational/down status

### API
- Checks API server responsiveness
- Measures response time
- Reports operational/down status

### Website
- Monitors web application availability
- Measures response time
- Reports operational/down status

## Customization

### Adding New Services

To monitor additional services, edit `server/status.ts`:

```typescript
async function checkNewServiceStatus(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Add your service check logic here
    const responseTime = Date.now() - start;
    
    return {
      name: "New Service",
      status: "operational",
      responseTime,
      lastChecked: new Date().toISOString(),
      uptime: 100
    };
  } catch (error) {
    return {
      name: "New Service",
      status: "down",
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      uptime: 0
    };
  }
}
```

Then add it to the `getSystemStatus` function:

```typescript
const services = await Promise.all([
  checkDatabaseStatus(),
  checkAPIStatus(),
  checkWebsiteStatus(),
  checkNewServiceStatus() // Add your new service here
]);
```

### Monitoring Intervals

- **Frontend refresh**: 30 seconds (status), 60 seconds (stats)
- **Background monitoring**: 30 seconds (configurable in `server/index.ts`)
- **Uptime Kuma**: Configurable per monitor (recommended: 60 seconds)

### Styling

The status page uses your existing UI components:
- Cards from `@/components/ui/card`
- Badges from `@/components/ui/badge`
- Progress bars from `@/components/ui/progress`
- Icons from `lucide-react`

## API Reference

### GET /api/status

Returns current system status:

```json
{
  "overall": "operational",
  "services": [
    {
      "name": "Database",
      "status": "operational",
      "responseTime": 5,
      "lastChecked": "2025-09-11T10:30:00.000Z",
      "uptime": 99.95
    }
  ],
  "lastUpdated": "2025-09-11T10:30:00.000Z"
}
```

### GET /api/status/uptime

Returns uptime statistics:

```json
{
  "stats": [
    {
      "service": "Database",
      "uptime": 99.95,
      "averageResponseTime": 8.5,
      "totalChecks": 1440
    }
  ]
}
```

## Troubleshooting

### Status Page Not Loading
- Check if the web server is running
- Verify the status API endpoints are accessible
- Check browser console for errors

### Uptime Kuma Connection Issues
- Ensure Docker containers are running: `docker-compose ps`
- Check container logs: `docker-compose logs uptime-kuma`
- Verify port 3001 is not in use by another service

### Database Connection Errors
- Check database container status
- Verify database credentials in environment variables
- Check network connectivity between containers

## Production Considerations

1. **Data Persistence**: Status history is stored in memory by default. For production, implement database storage.

2. **Security**: 
   - Secure Uptime Kuma with proper authentication
   - Use environment variables for sensitive configuration
   - Consider rate limiting for status endpoints

3. **Scalability**:
   - Implement Redis for shared status storage in multi-instance deployments
   - Use proper logging for monitoring alerts
   - Set up alerting based on status changes

4. **Monitoring**:
   - Monitor the monitoring system itself
   - Set up external health checks
   - Implement alerting for critical service failures

## Integration with External Services

The status system can be extended to monitor external dependencies:
- Discord API status
- Database hosting service
- CDN status
- Third-party APIs

Simply add new check functions following the existing pattern in `status.ts`.
