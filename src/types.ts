import { HardhatPluginError } from "hardhat/plugins";

export type Path = string;

export type HexString = `0x${string}`;

export function isHexString(arg: any): arg is HexString {
  return arg?.match(/^0x([0-9a-fA-F]{2})*$/);
}

export interface PredeployUserConfig {
  [key: HexString]:
    | {
        name: string;
        abi: any[] | Path;
        bytecode: HexString | Path;
      }
    | false;
}
export interface PredeployConfig {
  [key: HexString]:
    | {
        name: string;
        abi: any[];
        bytecode: HexString;
      }
    | false;
}

export type NestedContainer<T> = { [key: string]: T | NestedContainer<T> };

export function set<T>(container: NestedContainer<T>, name: string, instance: T): void {
  name.split(".").reduce((c, fragment, idx, { length }) => {
    if (idx == length - 1) {
      if (c[fragment]) throw new HardhatPluginError("hardhat-predeploy", "Predeploy: invalid definition path");
      c[fragment] = instance;
      return {};
    } else {
      return (c[fragment] ??= {});
    }
  }, container);
}
