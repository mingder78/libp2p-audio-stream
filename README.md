# 🌳 Treehole - P2P Audio Streaming

A decentralized peer-to-peer audio streaming application built with libp2p.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the relay server:**
   ```bash
   npm run deploy-relay
   ```

3. **Start the web server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   - Main interface: http://localhost:5173/home.html
   - Legacy sender: http://localhost:5173/index.html  
   - Legacy receiver: http://localhost:5173/index2.html

### Production Deployment

#### Deploy Relay Server

**Option 1: Railway**
1. Connect your GitHub repo to Railway
2. Deploy automatically with `railway.toml` configuration

**Option 2: Render/Heroku**
1. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=9001`
   - `WS_PORT=9002`
   - `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN=your_token`
2. Deploy with `npm start`

**Option 3: Docker**
```bash
docker build -t treehole-relay .
docker run -p 3000:3000 -p 9001:9001 -p 9002:9002 treehole-relay
```

#### Deploy Web Interface
```bash
npm run build
# Deploy dist/ folder to any static hosting service
```

## 🎯 Features

- **Unified Interface**: Combined sender and receiver in one page
- **P2P Audio Streaming**: Direct peer-to-peer audio transmission
- **WebRTC Support**: High-quality, low-latency audio
- **Automatic Relay Discovery**: Connects to public or local relays
- **Real-time Status**: Live connection and peer information
- **Quality Control**: Adjustable audio bitrate
- **Debug Tools**: Built-in logging and diagnostics

## 🏗️ Architecture

- **Frontend**: Vanilla JavaScript with Vite
- **P2P Layer**: libp2p with WebRTC, WebSockets, and Circuit Relay
- **Audio**: MediaRecorder API + MediaSource API
- **Discovery**: Gossipsub for peer and relay discovery
- **Relay**: Public relay server for NAT traversal

## 📱 Usage

1. **Open the main interface** at `/home.html`
2. **Wait for connection** to the P2P network
3. **Start streaming** to broadcast your audio
4. **Other peers** will automatically receive your stream
5. **Adjust quality** and volume as needed

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: production/development
- `PORT`: TCP port for relay (default: 9001)
- `WS_PORT`: WebSocket port for relay (default: 9002)
- `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`: For updating relay address in Gist

### Audio Settings
- **Low Quality**: 32kbps (good for voice)
- **Medium Quality**: 64kbps (balanced)
- **High Quality**: 128kbps (music quality)

## 🐛 Troubleshooting

### Connection Issues
1. Check if relay server is running
2. Verify firewall settings allow WebRTC
3. Try manual peer connection with multiaddr

### Audio Issues
1. Grant microphone permissions
2. Check browser audio codec support
3. Adjust audio quality settings

### Debug Mode
1. Click "Toggle Debug Info"
2. Enable logging for detailed information
3. Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

