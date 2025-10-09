import type { HardhatPlugin } from "hardhat/types/plugins";

import "../type-extensions.js";

const hardhatPredeployEthersPlugin: HardhatPlugin = {
  id: "hardhat-predeploy-ethers",
  hookHandlers: {
    network: () => import("../hook-handlers/network-populate-ethers.js"),
  },
  dependencies: () => [import("@nomicfoundation/hardhat-ethers")],
};

export default hardhatPredeployEthersPlugin;
