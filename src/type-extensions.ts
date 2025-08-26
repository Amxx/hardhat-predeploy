import "hardhat/types/config";
import "hardhat/types/network";

import type { HardhatEthers } from '@nomicfoundation/hardhat-ethers/types';
import type { HardhatViemHelpers } from '@nomicfoundation/hardhat-viem/types';
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
    ethers?: HardhatEthers & { predeploy: NestedContainer<ethers.Contract> },
    viem?: HardhatViemHelpers<ChainTypeT> & { predeploy: NestedContainer<any> }, // replace any with a generic viem contract type ?
    predeploy?: NestedContainer<ethers.Contract> | NestedContainer<any>,
  }
}
