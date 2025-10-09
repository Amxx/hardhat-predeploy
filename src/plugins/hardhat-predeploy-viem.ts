import type { HardhatPlugin } from "hardhat/types/plugins";

import "../type-extensions.js";

const hardhatPredeployViemPlugin: HardhatPlugin = {
  id: "hardhat-predeploy-viem",
  hookHandlers: {
    network: () => import("../hook-handlers/network-populate-viem.js"),
  },
  dependencies: () => [import("@nomicfoundation/hardhat-viem")],
};

export default hardhatPredeployViemPlugin;
