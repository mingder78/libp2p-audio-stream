# 🚀 Deploy Your Relay to Internet - Quick Guide

## ⚡ Quick Deploy (5 minutes)

### Option 1: Automated Railway Deployment
```bash
# Run the automated deployment script
node deploy-to-railway.js
```

### Option 2: Manual Railway Deployment
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=9001
railway variables set WS_PORT=9002
railway variables set HEALTH_PORT=3000

# 5. Deploy
railway up
```

### Option 3: One-Click Deploy
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy relay to cloud"
   git push origin main
   ```

2. **Go to Railway**: https://railway.app
3. **Click "Deploy from GitHub"**
4. **Select your repository**
5. **Railway auto-deploys** using `railway.toml`

## ✅ Verification

After deployment, test your relay:

```bash
# Replace with your Railway URL
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "peerId": "12D3KooW...",
  "connections": 0,
  "multiaddrs": [
    "/dns4/your-app.railway.app/tcp/443/wss/p2p/12D3KooW..."
  ]
}
```

## 🔧 Update Client

After successful deployment, update `constants.js`:

```javascript
// Replace with your actual deployment URL and peer ID
export const RELAY_MULTIADDR = '/dns4/your-app.railway.app/tcp/443/wss/p2p/YOUR_PEER_ID'
```

## 🎯 Test End-to-End

1. **Open**: `http://localhost:5173/home.html`
2. **Check**: Connection status shows "Connected to P2P network"
3. **Test**: Start streaming in one tab, open another tab
4. **Verify**: Audio streams through your cloud relay

## 🌍 Architecture Achieved

```
A peer (Browser) → Your Cloud Relay → B peer (Browser)
     ↓                    ↓                  ↓
Local Network      Railway/Cloud       Local Network
```

**Your relay peer is now running on the internet!** 🎉

## 🆘 Need Help?

- **Railway Issues**: Check Railway dashboard logs
- **Connection Issues**: Verify health endpoint works
- **Audio Issues**: Check browser console for errors

**You now have a professional P2P relay running on the internet!** 🌐