import type { HardhatPlugin } from "hardhat/types/plugins";

import "./type-extensions";

const hardhatPredeployCore: HardhatPlugin = {
  id: "hardhat-predeploy-core",
  hookHandlers: {
    config: () => import("./hook-handlers/config.js"),
    network: () => import("./hook-handlers/network-deploy.js"),
  },
};

const hardhatPredeployEthers: HardhatPlugin = {
  id: "hardhat-predeploy-ethers",
  hookHandlers: {
    network: () => import("./hook-handlers/network-populate-ethers.js"),
  },
  dependencies: () => [Promise.resolve({ default: hardhatPredeployCore }), import("@nomicfoundation/hardhat-ethers")],
};

const hardhatPredeployViem: HardhatPlugin = {
  id: "hardhat-predeploy-viem",
  hookHandlers: {
    network: () => import("./hook-handlers/network-populate-viem.js"),
  },
  dependencies: () => [Promise.resolve({ default: hardhatPredeployCore }), import("@nomicfoundation/hardhat-viem")],
};

const hardhatPredeployPlugin: HardhatPlugin = {
  id: "hardhat-predeploy",
  dependencies: () => [
    Promise.resolve({ default: hardhatPredeployCore }),
    import("@nomicfoundation/hardhat-viem").then(
      () => ({ default: hardhatPredeployViem }),
      () => ({ default: { id: "@nomicfoundation/hardhat-viem/not-found" } }),
    ),
    import("@nomicfoundation/hardhat-ethers").then(
      () => ({ default: hardhatPredeployEthers }),
      () => ({ default: { id: "@nomicfoundation/hardhat-ethers/not-found" } }),
    ),
  ],
  npmPackage: "hardhat-predeploy",
};

export default hardhatPredeployPlugin;
