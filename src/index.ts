import type { HardhatPlugin } from "hardhat/types/plugins";

import "./type-extensions";

const hardhatEthersPlugin: HardhatPlugin = {
  id: "hardhat-predeploy",
  hookHandlers: {
    config: () => import("./hook-handlers/config.js"),
    network: () => import("./hook-handlers/network.js"),
  },
  dependencies: () => [
    // Optional dependencies. We should use .catch(() => undefined) when https://github.com/NomicFoundation/hardhat/pull/7323
    // (or similar) is part of hardhat.
    import("@nomicfoundation/hardhat-ethers").catch(() => ({
      default: { id: "@nomicfoundation/hardhat-ethers/not-found" },
    })),
    import("@nomicfoundation/hardhat-viem").catch(() => ({
      default: { id: "@nomicfoundation/hardhat-viem/not-found" },
    })),
  ],
  npmPackage: "hardhat-predeploy",
};

export default hardhatEthersPlugin;
