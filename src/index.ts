import type { HardhatPlugin } from "hardhat/types/plugins";

import "./type-extensions";

const hardhatPredeployPlugin: HardhatPlugin = {
  id: "hardhat-predeploy",
  hookHandlers: {
    config: () => import("./hook-handlers/config.js"),
    network: () => import("./hook-handlers/network-deploy.js"),
  },
  dependencies: () => [
    import("@nomicfoundation/hardhat-ethers").then(
      hardhatEthers => ({
        default: {
          id: "hardhat-predeploy-ethers",
          hookHandlers: {
            network: () => import("./hook-handlers/network-populate-ethers.js"),
          },
          dependencies: () => [Promise.resolve(hardhatEthers)],
        },
      }),
      () => ({ default: { id: "@nomicfoundation/hardhat-ethers/not-found" } }),
    ),
    import("@nomicfoundation/hardhat-viem").then(
      hardhatViem => ({
        default: {
          id: "hardhat-predeploy-viem",
          hookHandlers: {
            network: () => import("./hook-handlers/network-populate-viem.js"),
          },
          dependencies: () => [Promise.resolve(hardhatViem)],
        },
      }),
      () => ({ default: { id: "@nomicfoundation/hardhat-viem/not-found" } }),
    ),
  ],
  npmPackage: "hardhat-predeploy",
};

export default hardhatPredeployPlugin;
