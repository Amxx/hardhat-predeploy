import type { HardhatPlugin } from "hardhat/types/plugins";

import "./type-extensions";

const hardhatEthersPlugin: HardhatPlugin = {
  id: "hardhat-predeploy",
  hookHandlers: {
    config: () => import("./hook-handlers/config.js"),
    network: () => import("./hook-handlers/network.js"),
  },
  dependencies: () => [
    // import("@nomicfoundation/hardhat-ethers"), // OPTIONAL
    // import("@nomicfoundation/hardhat-viem"), // OPTIONAL
  ],
  npmPackage: "hardhat-predeploy",
};

export default hardhatEthersPlugin;
