# Nexium RPG Status Page Integration Guide

## ✅ Current Status

- **Uptime Kuma**: ✅ Running on localhost:3001
- **Domain**: status.nexium-rpg.win (Cloudflare tunnel configured)
- **Health Endpoints**: ✅ Added to both bot and web services

## 🔧 Cloudflare Tunnel Configuration

Ensure your Cloudflare tunnel configuration includes:

```yaml
# cloudflared tunnel configuration
tunnel: <your-tunnel-id>
credentials-file: /path/to/credentials.json

ingress:
  - hostname: status.nexium-rpg.win
    service: http://localhost:3001
  - service: http_status:404
```

**Or via Cloudflare Dashboard:**
1. Go to Zero Trust → Access → Tunnels
2. Select your tunnel
3. Add a new public hostname:
   - **Subdomain**: status
   - **Domain**: nexium-rpg.win
   - **Service**: HTTP
   - **URL**: localhost:3001

## 🌐 Access Your Status Page

1. **Direct Local Access**: http://localhost:3001
2. **Public Access**: https://status.nexium-rpg.win

## 🔧 Initial Setup Steps

### 1. Create Admin Account
1. Navigate to https://status.nexium-rpg.win
2. Create admin username and password
3. Enable 2FA for security

### 2. Create Status Page
1. Go to **Settings** → **Status Page**
2. Click **Add Status Page**
3. Configure:
   - **Title**: "Nexium RPG Status"
   - **Slug**: "nexium"
   - **Description**: "Real-time status of Nexium RPG services"
   - **Theme**: Dark or Light (match your brand)
   - **Icon**: Upload Nexium RPG logo
   - **Public**: ✅ Enabled

### 3. Add Service Monitors

#### Discord Bot Monitor
- **Type**: HTTP(s)
- **Friendly Name**: "Nexium Discord Bot"
- **URL**: `http://localhost:3000/health`
- **Heartbeat Interval**: 60 seconds
- **Retries**: 1
- **Heartbeat Retry Interval**: 20 seconds
- **Accepted Status Codes**: 200-299

#### Web Application Monitor
- **Type**: HTTP(s)
- **Friendly Name**: "Nexium Web App"
- **URL**: `http://localhost:5000/health`
- **Heartbeat Interval**: 60 seconds
- **Retries**: 1
- **Heartbeat Retry Interval**: 20 seconds
- **Accepted Status Codes**: 200-299

#### Main Website Monitor
- **Type**: HTTP(s)
- **Friendly Name**: "Nexium RPG Website"
- **URL**: `https://nexium-rpg.win`
- **Heartbeat Interval**: 300 seconds
- **Retries**: 2
- **Heartbeat Retry Interval**: 30 seconds
- **Accepted Status Codes**: 200-299

#### Database Monitor (Optional)
- **Type**: TCP Port
- **Friendly Name**: "Database Server"
- **Hostname**: localhost
- **Port**: 5432 (or your database port)
- **Heartbeat Interval**: 120 seconds

### 4. Configure Notifications

#### Discord Notifications
1. Create a Discord webhook in your server:
   - Server Settings → Integrations → Webhooks
   - Create webhook for status updates channel
   - Copy webhook URL

2. In Uptime Kuma:
   - Go to **Settings** → **Notifications**
   - Add **Discord** notification
   - Paste webhook URL
   - Test the notification

#### Email Notifications
1. Configure SMTP settings:
   - **SMTP Host**: your-smtp-server.com
   - **Port**: 587 (or 465 for SSL)
   - **Username**: your-email@domain.com
   - **Password**: your-app-password
   - **From Email**: status@nexium-rpg.win
   - **To Email**: admin@nexium-rpg.win

### 5. Assign Monitors to Status Page
1. Go back to **Status Page** settings
2. Select your "Nexium RPG Status" page
3. **Select Monitors**: Add all your monitors
4. **Show Tags**: Enable if you want to categorize services
5. **Order**: Arrange monitors as desired

### 6. Customize Appearance
- **Custom CSS**: Add brand colors and styling
- **Footer Text**: Add links to documentation, support
- **Announcement**: Add any current maintenance notices
- **Timezone**: Set to your primary user base timezone

## 📊 Health Endpoint Details

### Bot Health Endpoint (`/health`)
```json
{
  "status": "ok",
  "timestamp": "2025-09-11T...",
  "service": "nexium-discord-bot",
  "version": "1.0.0",
  "uptime": 3600,
  "discord": {
    "ready": true,
    "guilds": 5,
    "users": 150,
    "ping": 45
  }
}
```

### Web App Health Endpoint (`/health`)
```json
{
  "status": "ok",
  "timestamp": "2025-09-11T...",
  "service": "nexium-web",
  "version": "1.0.0"
}
```

## 🔔 Notification Rules

### Recommended Setup:
- **Discord**: All service alerts
- **Email**: Critical alerts only
- **Down notifications**: Immediate
- **Up notifications**: After 1 successful check
- **Maintenance**: Schedule in advance

### Alert Conditions:
- **Bot Down**: Discord webhook immediately
- **Web Down**: Discord + Email
- **Website Slow**: Discord after 3 consecutive slow responses
- **Database Issues**: Email immediately

## 🔒 Security Considerations

1. **Admin Access**: Use strong password + 2FA
2. **API Keys**: Keep Discord webhook URLs secure
3. **Network**: Consider IP whitelisting for sensitive monitors
4. **SSL**: Ensure HTTPS only for public access

## 🌍 Public Status Page URL

Once configured, your public status page will be available at:
**https://status.nexium-rpg.win/status/nexium**

## 🧪 Testing

Use the included test scripts:
- Windows: `test-health-endpoints.bat`
- Linux/Mac: `test-health-endpoints.sh`

## 📋 Monitoring Checklist

- [ ] Uptime Kuma accessible via status.nexium-rpg.win
- [ ] Admin account created with 2FA
- [ ] Status page "nexium" created and public
- [ ] Discord bot monitor configured
- [ ] Web app monitor configured
- [ ] Website monitor configured
- [ ] Discord notifications configured
- [ ] Email notifications configured (optional)
- [ ] Status page customized with branding
- [ ] Health endpoints tested and responding

## 🎯 Next Steps

1. **Launch Services**: Start your bot and web app with Docker
2. **Monitor Setup**: Add all monitors to Uptime Kuma
3. **Test Alerts**: Temporarily stop a service to test notifications
4. **Documentation**: Share status page URL with your community
5. **Maintenance**: Set up scheduled maintenance windows

Your status page will provide real-time visibility into your Nexium RPG infrastructure!
