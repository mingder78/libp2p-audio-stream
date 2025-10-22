import { generateKeyPair } from '@libp2p/crypto/keys'
import * as X from '@libp2p/peer-id'
import fs from 'fs/promises';

// Example: generate an Ed25519 key
const key = await generateKeyPair('Ed25519', 2048)
console.log(key)

// Export the raw bytes
const publicKeyBytes = key.publicKey.raw
const privateKeyBytes = key.raw

// Optionally derive a PeerId
const peerId = await X.peerIdFromPrivateKey(key)
console.log(peerId)

// Make a JSON object
const json = {
  id: peerId.toString(),
  type: key.type,
  publicKey: Buffer.from(publicKeyBytes).toString('base64'),
  privateKey: Buffer.from(privateKeyBytes).toString('base64')
}

// Save to file
await fs.writeFile('peer-key.json', JSON.stringify(json, null, 2), 'utf8')
console.log('✅ Saved peer key to peer-key.json')

