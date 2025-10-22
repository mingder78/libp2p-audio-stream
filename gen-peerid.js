#!/usr/bin/env node
// Requires: npm i peer-id
import fs from 'fs';
import PeerId from 'peer-id';

async function main () {
  // create - default is RSA; pass options to create ed25519 if supported
  // Many peer-id versions support: PeerId.create({ keyType: 'Ed25519' })
  const id = await PeerId.create({ keyType: 'Ed25519' }).catch(async () => {
    // fallback to default create if keyType option not supported
    return PeerId.create();
  });

  // print base58 PeerId (commonly used in multiaddrs)
  console.log('peerId:', id.toB58String());

  // save JSON so you can reuse the same private key later
  const json = id.toJSON ? id.toJSON() : id.toJSON;
  fs.writeFileSync('peer-id.json', JSON.stringify(json, null, 2));
  console.log('saved peer-id.json');
}

main().catch(err => { console.error(err); process.exit(1); });
