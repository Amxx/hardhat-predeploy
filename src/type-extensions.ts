import "hardhat/types/config";
import "hardhat/types/runtime";

import type { ethers } from "ethers";
import type { HardhatEthersHelpers } from "@nomicfoundation/hardhat-ethers/types";
import type { PredeployUserConfig, PredeployConfig } from "./config";
import type { NestedContainer } from "./types";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    predeploy?: PredeployUserConfig;
  }

  export interface HardhatConfig {
    predeploy: PredeployConfig;
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    ethers: typeof ethers & HardhatEthersHelpers; // TODO: optional?
    predeploy: NestedContainer<ethers.Contract>;
  }
}
