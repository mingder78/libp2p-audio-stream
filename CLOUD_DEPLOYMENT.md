# 🌐 Cloud Deployment Guide - Internet Relay Peer

## 🎯 Architecture: A peer → Relay peer (Cloud) → B peer

This guide will deploy your relay peer to the internet so peers can connect through it.

## 🚀 Option 1: Railway (Recommended - Free Tier)

### Step 1: Prepare Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Ready for cloud deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-deploy** using `railway.toml`

### Step 3: Configure Environment Variables
In Railway dashboard:
```
NODE_ENV=production
PORT=9001
WS_PORT=9002
HEALTH_PORT=3000
```

### Step 4: Get Your Relay Address
After deployment:
1. **Check logs** for relay address
2. **Visit**: `https://your-app.railway.app/health`
3. **Copy the WebSocket multiaddr** from response

### Step 5: Update Client Configuration
Update `constants.js`:
```javascript
export const RELAY_MULTIADDR = '/dns4/your-app.railway.app/tcp/443/wss/p2p/YOUR_PEER_ID'
```

## 🚀 Option 2: Render (Free Tier)

### Step 1: Deploy to Render
1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click "New Web Service"**
4. **Connect your repository**
5. **Use these settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `3000` (for health check)

### Step 2: Configure Environment
```
NODE_ENV=production
PORT=9001
WS_PORT=9002
HEALTH_PORT=3000
```

## 🚀 Option 3: Heroku

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### Step 2: Create and Deploy
```bash
heroku create your-treehole-relay
heroku config:set NODE_ENV=production
heroku config:set PORT=9001
heroku config:set WS_PORT=9002
heroku config:set HEALTH_PORT=3000
git push heroku main
```

## 🚀 Option 4: DigitalOcean App Platform

### Step 1: Create App
1. **Go to**: https://cloud.digitalocean.com/apps
2. **Create App** from GitHub
3. **Select repository**
4. **Use these settings**:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: `3000`

## 🚀 Option 5: Docker (Any Cloud Provider)

### Step 1: Build and Push
```bash
# Build image
docker build -t treehole-relay .

# Tag for registry
docker tag treehole-relay your-registry/treehole-relay

# Push to registry
docker push your-registry/treehole-relay
```

### Step 2: Deploy to Cloud
Use the Docker image on:
- **Google Cloud Run**
- **AWS ECS**
- **Azure Container Instances**
- **DigitalOcean Container Registry**

## 🔍 Verification Steps

### 1. Check Health Endpoint
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "peerId": "12D3KooW...",
  "connections": 0,
  "multiaddrs": [
    "/dns4/your-app.railway.app/tcp/443/wss/p2p/12D3KooW...",
    "/ip4/x.x.x.x/tcp/9001/p2p/12D3KooW..."
  ]
}
```

### 2. Test P2P Connection
1. **Update** `constants.js` with your cloud relay address
2. **Open** `http://localhost:5173/home.html`
3. **Check** connection status shows "Connected to P2P network"
4. **Verify** peer count > 0

### 3. Test Audio Streaming
1. **Open two browser tabs** with your app
2. **Start streaming** in one tab
3. **Verify audio** plays in the other tab
4. **Check logs** for relay activity

## 🐛 Troubleshooting

### Common Issues

**1. Health check fails**
```bash
# Check if service is running
curl -I https://your-app.railway.app/health
# Should return 200 OK
```

**2. WebSocket connection fails**
- Ensure WSS (secure WebSocket) is used in production
- Check if port 443 is accessible
- Verify SSL certificate is valid

**3. P2P connection timeout**
- Check firewall settings
- Verify STUN servers are accessible
- Ensure relay has public IP

**4. High memory usage**
- Monitor connection count
- Implement connection limits if needed
- Check for memory leaks in logs

### Debug Commands
```bash
# Check relay logs
heroku logs --tail -a your-app-name

# Test WebSocket connection
wscat -c wss://your-app.railway.app:9002

# Monitor health
watch -n 5 'curl -s https://your-app.railway.app/health | jq .'
```

## 📊 Monitoring

### Key Metrics to Monitor
- **Health status**: Should always be "healthy"
- **Connection count**: Number of active peers
- **Memory usage**: Should stay under platform limits
- **CPU usage**: Should be low (mostly I/O bound)
- **Network traffic**: Audio data throughput

### Alerts to Set Up
- Health check failures
- High memory usage (>80% of limit)
- Connection count spikes
- Error rate increases

## 💰 Cost Optimization

### Free Tier Limits
- **Railway**: 500 hours/month, 1GB RAM
- **Render**: 750 hours/month, 512MB RAM
- **Heroku**: 550 hours/month, 512MB RAM

### Resource Usage
- **Base memory**: ~100MB
- **Per 100 connections**: ~10MB additional
- **CPU**: Very low (I/O bound)
- **Bandwidth**: Depends on audio traffic

## 🔒 Security Best Practices

### Production Security
1. **Use HTTPS/WSS** only
2. **Set connection limits**
3. **Implement rate limiting**
4. **Monitor for abuse**
5. **Use secure environment variables**

### Firewall Configuration
Allow inbound traffic on:
- **Port 443**: HTTPS/WSS
- **Port 9001**: TCP P2P (if needed)
- **Port 3000**: Health checks

## ✅ Success Checklist

- [ ] Relay deployed to cloud platform
- [ ] Health endpoint returns 200 OK
- [ ] WebSocket connection works (WSS)
- [ ] P2P peers can connect through relay
- [ ] Audio streaming works end-to-end
- [ ] Monitoring and alerts configured
- [ ] Client updated with cloud relay address

## 🎉 Final Result

After successful deployment:
```
A peer (Browser) → Cloud Relay Peer → B peer (Browser)
     ↓                    ↓                  ↓
Local Network      Internet Cloud      Local Network
```

Your relay peer is now running on the internet, enabling P2P connections between any browsers worldwide! 🌍