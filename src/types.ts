import { HardhatPluginError } from "hardhat/plugins";

export type Path = string;

export type HexString = `0x${string}`;

export function isHexString(arg: any): arg is HexString {
  return arg?.match(/^0x([0-9a-fA-F]{2})*$/);
}

export type NestedContainer<T> = { [key: string]: T | NestedContainer<T> };

export function set<T>(
  container: NestedContainer<T>,
  name: string,
  instance: T,
): void {
  name.split(".").reduce((c, fragment, idx, { length }) => {
    if (idx == length - 1) {
      if (c[fragment])
        throw new HardhatPluginError("Predeploy: invalid definition path");
      c[fragment] = instance;
      return {};
    } else {
      return (c[fragment] ??= {});
    }
  }, container);
}
