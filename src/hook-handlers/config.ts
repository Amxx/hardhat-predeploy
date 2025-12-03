import fs from "fs";

import type { ConfigurationVariableResolver, HardhatUserConfig, HardhatConfig } from "hardhat/types/config";
import type { ConfigHooks } from "hardhat/types/hooks";

import { HexString, isHexString } from "../types.js";
import { defaultConfig } from "../defaultConfig.js";

export default async (): Promise<Partial<ConfigHooks>> => ({
  extendUserConfig: (
    userConfig: HardhatUserConfig,
    next: (nextConfig: HardhatUserConfig) => Promise<HardhatUserConfig>,
  ): Promise<HardhatUserConfig> =>
    next(userConfig).then((extendedUserConfig: HardhatUserConfig) => {
      extendedUserConfig.predeploy = {
        alias: { ...defaultConfig.alias, ...extendedUserConfig.predeploy?.alias },
        artifacts: { ...defaultConfig.artifacts, ...extendedUserConfig.predeploy?.artifacts },
      };
      return extendedUserConfig;
    }),

  resolveUserConfig: (
    userConfig: HardhatUserConfig,
    resolveConfigurationVariable: ConfigurationVariableResolver,
    next: (
      nextUserConfig: HardhatUserConfig,
      nextResolveConfigurationVariable: ConfigurationVariableResolver,
    ) => Promise<HardhatConfig>,
  ): Promise<HardhatConfig> =>
    next(userConfig, resolveConfigurationVariable).then((resolvedConfig: HardhatConfig) => {
      resolvedConfig.predeploy = {
        alias: userConfig.predeploy?.alias ?? {},
        artifacts: Object.fromEntries(
          Object.entries(userConfig.predeploy?.artifacts ?? {}).map(([address, details]) => [
            address as HexString,
            details
              ? {
                  abi: Array.isArray(details.abi)
                    ? details.abi
                    : (JSON.parse(fs.readFileSync(details.abi, "utf-8")) as any[]),
                  bytecode: isHexString(details.bytecode)
                    ? details.bytecode
                    : (`0x${fs.readFileSync(details.bytecode, "hex").replace(/0x/, "")}` as HexString),
                }
              : (false as false),
          ]),
        ),
      };
      return resolvedConfig;
    }),
});
