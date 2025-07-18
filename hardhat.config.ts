import "./src/plugin";

import "@nomicfoundation/hardhat-ethers";

import type { HardhatUserConfig } from "hardhat/config";

export default <HardhatUserConfig>{
  networks: {
    mainnet: {
      url: process.env.MAINNET_NODE,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  predeploy: {
    "0x0000000071727De22E5E9d8BAf0edAc6f37da032": false, // disable entrypoint.v07
    "0xEFC2c1444eBCC4Db75e7613d20C6a62fF67A167C": false, // disable senderCreator.v07
  },
};
