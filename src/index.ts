import type { HardhatPlugin } from "hardhat/types/plugins";

import "./type-extensions";

const hardhatEthersPlugin: HardhatPlugin = {
  id: "hardhat-predeploy",
  hookHandlers: {
    config: () => import("./hook-handlers/config.js"),
    network: () => import("./hook-handlers/network.js"),
  },
  dependencies: () => [
    // import("@nomicfoundation/hardhat-ethers"), // Now do we deal with optional dependencies?
    // import("@nomicfoundation/hardhat-viem"), // Now do we deal with optional dependencies?
  ],
  npmPackage: "hardhat-predeploy",
};

export default hardhatEthersPlugin;
