# 🚀 Quick Start Guide

## 🎯 What is Treehole?

Treehole is a decentralized peer-to-peer audio streaming application. Share your voice directly with others without any central server!

## 🏃‍♂️ Quick Start (5 minutes)

### 1. Start the Application
```bash
# Install dependencies
npm install

# Start all services
npm run deploy-relay  # Terminal 1: P2P Relay
npm run dev           # Terminal 2: Web Interface
```

### 2. Open the App
Visit: **http://localhost:5173/home.html**

### 3. Start Streaming
1. **Grant microphone permission** when prompted
2. **Wait for "Connected to P2P network"** status
3. **Click "Start Streaming"** to broadcast your audio
4. **Open another browser tab** to test receiving

## 🎮 How to Use

### For Streamers
1. **Choose audio quality**: Low (32kbps) → High (128kbps)
2. **Click "Start Streaming"** 
3. **Speak into your microphone**
4. **Watch the subscriber count** to see who's listening

### For Listeners
1. **Open the same page** in another browser/device
2. **Audio will play automatically** when someone streams
3. **Adjust volume** with the slider
4. **See real-time connection info**

## 🌐 Share with Others

### Local Network
Share this URL with others on your network:
```
http://YOUR_LOCAL_IP:5173/home.html
```

### Internet (Deploy)
Deploy your relay to the cloud:
- **Railway**: One-click deploy
- **Render**: Free tier available  
- **Heroku**: Easy deployment

## 🔧 Troubleshooting

### No Audio?
- ✅ Grant microphone permissions
- ✅ Check if someone is streaming
- ✅ Verify browser audio support

### Connection Issues?
- ✅ Wait for "Connected" status
- ✅ Check if relay is running
- ✅ Try refreshing the page

### No Peers?
- ✅ Open multiple browser tabs
- ✅ Share the URL with friends
- ✅ Check network connectivity

## 🎨 Features

- **🎙️ Real-time Audio Streaming**
- **🔗 Peer-to-Peer Connection**
- **📊 Live Network Status**
- **🎛️ Quality Control**
- **🔍 Debug Tools**
- **📱 Mobile Friendly**

## 🚀 Next Steps

1. **Deploy to the cloud** for global access
2. **Customize the interface** 
3. **Add more features** (chat, file sharing)
4. **Scale with multiple relays**

## 💡 Tips

- **Use headphones** to prevent audio feedback
- **Good internet connection** for best quality
- **Chrome/Firefox** work best
- **HTTPS required** for production deployment

---

**Need help?** Check the full README.md or open an issue!