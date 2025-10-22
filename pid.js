import * as PeerId from 'peer-id';
import fs from 'fs'
import { generateKeyPair } from '@libp2p/crypto/keys';

async function main() {
  let peerId
  const file = './peer-id.json'

  if (fs.existsSync(file)) {
    // Load existing PeerId
    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    peerId = await PeerId.createFromJSON(json)
  } else {
    // Create new PeerId
  const kp = await generateKeyPair('Ed25519')
console.log(kp)
   // fs.writeFileSync(file, JSON.stringify(json))
  }

  console.log('PeerId:', peerId)
}

main()
