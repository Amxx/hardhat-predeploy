import type { HardhatUserConfig } from "hardhat/config";

import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatEthersChaiMatchers from "@nomicfoundation/hardhat-ethers-chai-matchers";
import hardhatMocha from "@nomicfoundation/hardhat-mocha";
import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";
import hardhatPredeploy from "hardhat-predeploy";

export default {
  plugins: [hardhatEthers, hardhatEthersChaiMatchers, hardhatMocha, hardhatNetworkHelpers, hardhatPredeploy],
  predeploy: {
    "0x0000000071727De22E5E9d8BAf0edAc6f37da032": false, // disable entrypoint.v07
    "0xEFC2c1444eBCC4Db75e7613d20C6a62fF67A167C": false, // disable senderCreator.v07
  },
} as HardhatUserConfig;
