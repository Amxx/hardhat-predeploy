import "hardhat/types/config";
import "hardhat/types/network";

import type { ethers } from "ethers";
import type { PredeployUserConfig, PredeployConfig, NestedContainer } from "./types.js";

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
    predeploy: NestedContainer<ethers.Contract>;
  }
}
