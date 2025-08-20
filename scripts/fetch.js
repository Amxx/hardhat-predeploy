#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const {
  argv: { addresses, chainid, target },
} = yargs(hideBin(process.argv))
  .env('')
  .options({
    addresses: { alias: 'a', type: 'string', array: true },
    chainid: { alias: 'c', type: 'number', default: 1 },
    target: { alias: 't', type: 'string', default: path.resolve('bin') },
  });

Promise.all(
  addresses.map(addr =>
    fetch(`https://sourcify.dev/server/v2/contract/${chainid}/${addr}?fields=abi,creationBytecode.onchainBytecode`)
      .then(response => response.json())
      .then(({ abi, creationBytecode: { onchainBytecode }}) => {
        fs.writeFileSync(path.join(target, `${addr}.abi`), JSON.stringify(abi), 'utf-8');
        fs.writeFileSync(path.join(target, `${addr}.bytecode`), onchainBytecode.replace(/0x/, ''), 'hex');
      })
  )
).finally(() => {
  if (!process.exitCode) {
    console.log('All artifacts fetched successfully.');
  }
});
