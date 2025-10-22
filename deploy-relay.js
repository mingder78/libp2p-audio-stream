// @ts-check
import { createLibp2p } from 'libp2p'
import { autoNAT } from '@libp2p/autonat'
import { identify } from '@libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { webSockets } from '@libp2p/websockets'
import { tcp } from '@libp2p/tcp'
import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { PUBSUB_PEER_DISCOVERY, PUBSUB_AUDIO } from './constants.js'
import dotenv from 'dotenv';
dotenv.config();

async function updateGist(gistId, newContent, filename = 'relay-address.txt') {
  const token = process.env.YOUR_GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    console.warn('⚠️ No GitHub token found, skipping Gist update');
    return;
  }

  const gist = {
    description: 'Treehole P2P Relay Address - Auto Updated',
    files: {
      [filename]: {
        content: newContent
      }
    }
  };

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gist)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Gist updated:', data.html_url);
      return data.html_url;
    } else {
      console.error('❌ Error updating gist:', response.status);
    }
  } catch (error) {
    console.error('❌ Gist update error:', error);
  }
}

async function main() {
  console.log('🚀 Starting Treehole P2P Relay Server...');
  
  // Get port from environment or use default
  const port = process.env.PORT || 9001;
  const wsPort = process.env.WS_PORT || 9002;
  
  console.log(`🔧 Configuration:
    - TCP Port: ${port}
    - WebSocket Port: ${wsPort}
    - Health Port: ${process.env.HEALTH_PORT || 3001}
    - Environment: ${process.env.NODE_ENV || 'development'}
  `);
  
  const node = await createLibp2p({
    addresses: {
      listen: [
        `/ip4/0.0.0.0/tcp/${wsPort}/ws`,
        `/ip4/0.0.0.0/tcp/${port}`,
        // Add IPv6 support for cloud platforms
        `/ip6/::/tcp/${wsPort}/ws`,
        `/ip6/::/tcp/${port}`,
      ],
    },
    transports: [
      webSockets(),
      tcp(),
    ],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    connectionGater: {
      // Allow all connections for public relay
      denyDialMultiaddr: async () => false,
    },
    services: {
      identify: identify(),
      autoNat: autoNAT(),
      relay: circuitRelayServer({
        reservations: {
          maxReservations: 100, // Allow more reservations for public use
          reservationTtl: 30 * 60 * 1000, // 30 minutes
        }
      }),
      pubsub: gossipsub({
        allowPublishToZeroTopicPeers: true,
        emitSelf: false,
        fallbackToFloodsub: true,
      }),
    },
  });

  // Subscribe to topics
  await node.services.pubsub.subscribe(PUBSUB_PEER_DISCOVERY);
  await node.services.pubsub.subscribe(PUBSUB_AUDIO);

  console.log('🆔 PeerID:', node.peerId.toString());
  console.log('🌐 Multiaddrs:');
  node.getMultiaddrs().forEach(addr => {
    console.log('  ', addr.toString());
  });

  // Update Gist with relay address
  const relayAddr = node.getMultiaddrs().find(addr => 
    addr.toString().includes('/ws/') && !addr.toString().includes('127.0.0.1')
  ) || node.getMultiaddrs()[0];
  
  if (relayAddr) {
    const gistId = 'ee220400038070276eaf3d33680e0e0a';
    await updateGist(gistId, relayAddr.toString());
  }

  // Event listeners
  node.services.pubsub.addEventListener('message', (evt) => {
    if (evt.detail.topic === PUBSUB_AUDIO) {
      console.log('🎵 Audio message relayed, size:', evt.detail.data.length);
    }
  });

  node.addEventListener('peer:connect', (evt) => {
    console.log('🔗 Peer connected:', evt.detail.toString());
  });

  node.addEventListener('peer:disconnect', (evt) => {
    console.log('🔌 Peer disconnected:', evt.detail.toString());
  });

  // Health check endpoint for deployment platforms
  if (true) { // Always enable health check
    const http = await import('http');
    const server = http.createServer((req, res) => {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          peerId: node.peerId.toString(),
          connections: node.getConnections().length,
          multiaddrs: node.getMultiaddrs().map(addr => addr.toString())
        }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });
    
    const healthPort = process.env.HEALTH_PORT || 3001;
    server.listen(healthPort, () => {
      console.log(`🏥 Health check server running on port ${healthPort}`);
    });
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down relay server...');
    await node.stop();
    process.exit(0);
  });

  console.log('✅ Treehole P2P Relay Server is running!');
  console.log('📡 Ready to relay P2P connections and audio streams');
}

main().catch(console.error);