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

declare module "@nomicfoundation/hardhat-ethers/types" {
  interface HardhatEthersHelpers {
    predeploy: NestedContainer<ethers.Contract>;
  }
}

declare module "@nomicfoundation/hardhat-viem/types" {
  interface HardhatViemHelpers {
    predeploy: NestedContainer<any>;
  }
}