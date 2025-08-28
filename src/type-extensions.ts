import "hardhat/types/config";
import "hardhat/types/network";

import type { PredeployUserConfig, PredeployConfig, NestedContainer } from "./types.js";
import type { ethers } from "ethers";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    predeploy?: PredeployUserConfig;
  }

  export interface HardhatConfig {
    predeploy: PredeployConfig;
  }
}

declare module "hardhat/types/network" {
  interface NetworkConnection<ChainTypeT extends ChainType | string = DefaultChainType> {
    predeploy: NestedContainer<ethers.Contract> | NestedContainer<any>; // replace any with a generic viem contract type ?
  }
}
