import fs from "fs";
import { Path, HexString, isHexString } from "./types";

export interface PredeployUserConfig {
  [key: HexString]:
    | {
        name: string;
        abi?: any[] | Path;
        bytecode?: HexString | Path;
      }
    | false;
}
export interface PredeployConfig {
  [key: HexString]: {
    name: string;
    abi: any[];
    bytecode: HexString;
  };
}

export function resolve(input: PredeployUserConfig): PredeployConfig {
  const output: PredeployConfig = {};
  Object.entries(input).map(([address, details]) => {
    if (details) {
      output[address as HexString] = {
        name: details.name,
        abi: Array.isArray(details.abi)
          ? details.abi
          : JSON.parse(fs.readFileSync(details.abi, "utf-8")),
        bytecode: isHexString(details.bytecode)
          ? details.bytecode
          : `0x${fs.readFileSync(details.bytecode, "hex").replace(/0x/, "")}`,
      };
    }
  });
  return output;
}
