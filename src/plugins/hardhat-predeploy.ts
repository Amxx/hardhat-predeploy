import type { HardhatPlugin } from "hardhat/types/plugins";
import type {} from '../type-extensions.ts';

const hardhatPredeployPlugin: HardhatPlugin = {
  id: "hardhat-predeploy",
  hookHandlers: {
    config: () => import("../hook-handlers/config.js"),
    network: () => import("../hook-handlers/network-deploy.js"),
  },
  conditionalDependencies: [
    {
      condition: () => [import("@nomicfoundation/hardhat-ethers")],
      plugin: () => import("./hardhat-predeploy-ethers.js"),
    },
    {
      condition: () => [import("@nomicfoundation/hardhat-viem")],
      plugin: () => import("./hardhat-predeploy-viem.js"),
    },
  ],
  npmPackage: "hardhat-predeploy",
};

export default hardhatPredeployPlugin;
