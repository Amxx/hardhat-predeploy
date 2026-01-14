import type { HardhatPlugin } from "hardhat/types/plugins";
import type {} from '../type-extensions.ts';

const hardhatPredeployEthersPlugin: HardhatPlugin = {
  id: "hardhat-predeploy-ethers",
  hookHandlers: {
    network: () => import("../hook-handlers/network-populate-ethers.js"),
  },
  dependencies: () => [import("@nomicfoundation/hardhat-ethers")],
};

export default hardhatPredeployEthersPlugin;
