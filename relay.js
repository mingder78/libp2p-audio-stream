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
import { WebRTC, WebSockets, WebSocketsSecure, WebTransport, Circuit, WebRTCDirect } from '@multiformats/multiaddr-matcher'
import dotenv from 'dotenv';
dotenv.config();

async function updateGist(gistId, newContent, filename = 'text.txt') {
  const token = process.env.YOUR_GITHUB_PERSONAL_ACCESS_TOKEN; // Replace with your token
  const gist = {
    description: 'Updated Gist via JS', // Optional: Update description
    files: {
      [filename]: {
        content: newContent // New content for the file
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
      console.log('Gist updated:', data.html_url);
      return data.html_url;
    } else {
      console.error('Error updating gist:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  // enable('*')
  const node = await createLibp2p({
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/9001/ws',
        '/ip4/0.0.0.0/tcp/9002',
      ],
    },
    transports: [
      webSockets(),
      tcp(),
    ],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    services: {
      identify: identify(),
      autoNat: autoNAT(),
      relay: circuitRelayServer(),
      pubsub: gossipsub(
       {
        allowPublishToZeroPeers: true // Example option
      }
      ),
    },
  })

  node.services.pubsub.subscribe(PUBSUB_PEER_DISCOVERY)
  node.services.pubsub.subscribe(PUBSUB_AUDIO)

  console.log('PeerID: ', node.peerId.toString())
  console.log('Multiaddrs: ', node.getMultiaddrs())

const newContent = node.getMultiaddrs()[0].toString()
const gistId = 'ee220400038070276eaf3d33680e0e0a'; // Replace with your Gist ID
updateGist(gistId, newContent);


   node.services.pubsub.addEventListener('message', (evt) => {
  //   console.log('Received audio chunk from', evt.detail)
    // evt.detail.data is a Uint8Array of the audio chunk
// tracking
  })


 // Add a listener for messages on this topic
node.services.pubsub.addEventListener('message', (message) => {
      if (message.detail.topic !== "browser-peer-discovery") {
    //console.log(`${message.detail.topic}:`, new TextDecoder().decode(message.detail.data))
}})

node.addEventListener('peer:connect', (evt) => {
  const peerId = evt.detail
  console.log('Connection established to:', peerId.toString()) // Emitted when a peer has been found
})

node.addEventListener('peer:discovery', (evt) => {
  const peerInfo = evt.detail

  console.log('Discovered:', peerInfo.id.toString())
})

node.addEventListener('gossipsub:heartbeat', (event) => {
  console.log('gossipsub:heartbeat❤️', event)
})

node.addEventListener('connection:open', (event) => {
  console.log('Peer A addrs:', node.getMultiaddrs().map(a => a.toString()))
})
node.addEventListener('connection:close', (event) => {
  console.log('connection closed:', event)
})


node.addEventListener('self:peer:update', (event) => {
  // Update multiaddrs list, only show WebRTC addresses
  const multiaddrs = node.getMultiaddrs()
    .filter(ma => WebRTC.matches(ma))
    .map((ma) => {
      const el = document.createElement('li')
      el.textContent = ma.toString()
      return el
    })
  console.log(...multiaddrs)
})
}

main()
