import { peerIdFromString } from '@libp2p/peer-id'
import * as K from '@libp2p/crypto/keys'
import { privateKeyFromProtobuf, generateKeyPair, privateKeyToProtobuf } from '@libp2p/crypto/keys'
import fs from 'fs/promises'
import { privateKeyFromCryptoKeyPair } from '@libp2p/crypto/keys'
import { createFromPrivKey } from '@libp2p/peer-id-factory'

async function saveKey() {
  // Generate new Ed25519 keypair
  const privateKey = await generateKeyPair('Ed25519')
console.log(privateKey)

  // Serialize to protobuf bytes
  const proto = privateKeyToProtobuf(privateKey) // Uint8Array

console.log(proto)
  // Save as Base64
  const output = {
    type: 'Ed25519',
    privateKey: Buffer.from(proto).toString('base64'),
  }

  await fs.writeFile('peer-key.json', JSON.stringify(output, null, 2))
  console.log('✅ Saved key to peer-key.json')
}

saveKey()

async function loadKey() {
  const data = await fs.readFile('peer-key.json', 'utf8')
  const json = JSON.parse(data)
console.log(json)
  // Base64 → Uint8Array
  const proto = Uint8Array.from(Buffer.from(json.privateKey, 'base64'))

  // Restore libp2p key object
  const privateKey = privateKeyFromProtobuf(proto)

  // Recreate PeerId
  const peerId = await createFromPrivKey(privateKey.bytes)

  console.log('✅ Restored PeerId:', peerId.toString())
}

loadKey()

const peer = peerIdFromString('k51qzi5uqu5dkwkqm42v9j9kqcam2jiuvloi16g72i4i4amoo2m8u3ol3mqu6s')

console.log(peer) // CID(bafzaa...)
console.log(K)
