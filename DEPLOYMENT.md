# 🚀 Deployment Guide for Treehole P2P Audio Streaming

## Quick Deploy Options

### 1. Railway (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

1. Fork this repository
2. Connect to Railway
3. Set environment variables:
   - `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` (optional, for Gist updates)
4. Deploy automatically

### 2. Render
1. Fork this repository
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Set environment variables:
   - `NODE_ENV=production`
   - `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` (optional)

### 3. Heroku
```bash
# Install Heroku CLI
heroku create your-treehole-relay
heroku config:set NODE_ENV=production
heroku config:set YOUR_GITHUB_PERSONAL_ACCESS_TOKEN=your_token
git push heroku main
```

### 4. DigitalOcean App Platform
1. Fork this repository
2. Create new App on DigitalOcean
3. Connect GitHub repo
4. Use these settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 3000

### 5. Vercel (Static Frontend Only)
```bash
npm run build
vercel --prod
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | No | TCP port (default: 9001) |
| `WS_PORT` | No | WebSocket port (default: 9002) |
| `HEALTH_PORT` | No | Health check port (default: 3000) |
| `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` | No | For auto-updating Gist with relay address |

## Port Configuration

Your deployment platform needs to expose these ports:
- **3000**: Health check endpoint
- **9001**: TCP transport for P2P
- **9002**: WebSocket transport for browsers

## Health Check

The relay server provides a health endpoint at `/health`:
```json
{
  "status": "healthy",
  "peerId": "12D3KooW...",
  "connections": 5,
  "multiaddrs": [...]
}
```

## Custom Domain Setup

After deployment, update your frontend to use the public relay:

1. Get your deployment URL (e.g., `https://your-app.railway.app`)
2. Update `constants.js`:
```javascript
export const RELAY_MULTIADDR = '/dns4/your-app.railway.app/tcp/443/wss/p2p/YOUR_PEER_ID'
```

## Monitoring

### Logs
Check your deployment platform's logs for:
- `✅ Treehole P2P Relay Server is running!`
- `🔗 Peer connected: ...`
- `🎵 Audio message relayed`

### Metrics
Monitor these metrics:
- Connected peers count
- Audio messages relayed per minute
- Memory usage
- CPU usage

## Troubleshooting

### Common Issues

**1. Port binding errors**
- Ensure your platform supports the required ports
- Check if ports are already in use

**2. WebSocket connection failures**
- Verify WSS (secure WebSocket) is enabled
- Check firewall settings

**3. P2P connection issues**
- Ensure NAT traversal is working
- Check if STUN servers are accessible

**4. High memory usage**
- Monitor peer connections
- Implement connection limits if needed

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=libp2p:*
```

## Scaling

### Horizontal Scaling
Deploy multiple relay instances in different regions:
```javascript
const relays = [
  '/dns4/relay-us.your-domain.com/tcp/443/wss/p2p/PEER_ID_1',
  '/dns4/relay-eu.your-domain.com/tcp/443/wss/p2p/PEER_ID_2',
  '/dns4/relay-asia.your-domain.com/tcp/443/wss/p2p/PEER_ID_3'
];
```

### Load Balancing
Use a load balancer for the health check endpoint, but P2P connections will be direct.

## Security

### Best Practices
1. Use HTTPS/WSS in production
2. Implement rate limiting
3. Monitor for abuse
4. Set connection limits
5. Use secure environment variables

### Firewall Rules
Allow inbound traffic on:
- Port 3000 (HTTP health checks)
- Port 9001 (TCP P2P)
- Port 9002 (WebSocket P2P)

## Cost Optimization

### Free Tier Options
- **Railway**: 500 hours/month free
- **Render**: 750 hours/month free
- **Heroku**: 550 hours/month free (with credit card)

### Resource Usage
- **CPU**: Low (mostly I/O bound)
- **Memory**: ~100MB base + ~10MB per 100 connections
- **Bandwidth**: Depends on audio traffic

## Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Test with local relay
4. Open an issue on GitHub

## Example Production URLs

After deployment, your relay will be available at:
- Health: `https://your-app.railway.app/health`
- WebSocket: `wss://your-app.railway.app:9002`
- P2P: `/dns4/your-app.railway.app/tcp/443/wss/p2p/YOUR_PEER_ID`