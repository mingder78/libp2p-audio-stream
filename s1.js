import { peerIdFromString } from '@libp2p/peer-id'
import fs from 'fs/promises'
import { privateKeyFromProtobuf, generateKeyPair, privateKeyToProtobuf } from '@libp2p/crypto/keys'
import { createFromPrivKey } from '@libp2p/peer-id-factory'
import { decodePrivateKey, encodePrivateKey } from './peer-id.js'

export async function savePeerId(peerId, filePath = 'peer-id.json') {
console.log(peerId)
  const proto = privateKeyToProtobuf(peerId.privKey) // Uint8Array
  const output = {
    id: peerId.toString(),                     // base58 string
    type: 'Ed25519',
    privateKey: Buffer.from(proto).toString('base64'),
    publicKey: Buffer.from(peerId.pubKey.bytes).toString('base64')
  }

  await fs.writeFile(filePath, JSON.stringify(output, null, 2))
  console.log('✅ PeerId saved to', filePath)
}


export async function loadPeerId(filePath = 'peer-id.json') {
  const data = await fs.readFile(filePath, 'utf8')
  const json = JSON.parse(data)

  const privBytes = Uint8Array.from(Buffer.from(json.privateKey, 'base64'))
  const privateKey = privateKeyFromProtobuf(privBytes)
  const peerId = await createFromPrivKey(privateKey.bytes)

  console.log('✅ PeerId loaded:', peerId.toString())
  return peerId
}

export async function getPeerId() {
const peer = peerIdFromString('k51qzi5uqu5dkwkqm42v9j9kqcam2jiuvloi16g72i4i4amoo2m8u3ol3mqu6s')
//await savePeerId(peer)

  const libp2pGeneratedPrivateKey = await generateKeyPair('Ed25519')
console.log(libp2pGeneratedPrivateKey)
const    privateKey = encodePrivateKey(libp2pGeneratedPrivateKey)
    console.log(privateKey)
// await fs.writeFile('peer-ok.json', privateKey)

 // console.log('✅ Saved key to peer-ok.json')

const data = await fs.readFile('peer-ok.json', 'utf8')
console.log(data)
const original = decodePrivateKey(data)
console.log(original)
	return original;
}
