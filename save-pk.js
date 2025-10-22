import fs from 'fs/promises'
import { keys } from '@libp2p/crypto'

const data = await fs.readFile('peer-key.json', 'utf8')
const json = JSON.parse(data)

// Convert Base64 → Uint8Array
const pubBytes = Uint8Array.from(Buffer.from(json.publicKey, 'base64'))
const privBytes = Uint8Array.from(Buffer.from(json.privateKey, 'base64'))

// Rebuild key objects using the supportedKeys API
const privateKey = keys.supportedKeys[json.type].unmarshal(privBytes)
const publicKey = keys.supportedKeys[json.type].unmarshal(pubBytes)

// Keypair object
const keypair = {
  id: json.id,
  type: json.type,
  public: publicKey,
  private: privateKey
}

console.log('✅ Restored keypair:', keypair)

