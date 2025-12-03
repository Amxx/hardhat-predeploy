import type { PredeployUserConfig } from "./types.js";

import path from "path";

const resolveBin = (file: string) =>
  import.meta.filename.endsWith(".ts")
    ? path.resolve(import.meta.dirname, "..", "bin", file)
    : path.resolve(import.meta.dirname, "..", "..", "bin", file);

export const defaultConfig: PredeployUserConfig = {
  "0x0000000071727De22E5E9d8BAf0edAc6f37da032": {
    name: "entrypoint.v07",
    abi: resolveBin("0x0000000071727De22E5E9d8BAf0edAc6f37da032.abi"),
    bytecode: resolveBin("0x0000000071727De22E5E9d8BAf0edAc6f37da032.bytecode"),
  },
  "0xEFC2c1444eBCC4Db75e7613d20C6a62fF67A167C": {
    name: "senderCreator.v07",
    abi: resolveBin("0x0000000071727De22E5E9d8BAf0edAc6f37da032.abi"),
    bytecode: resolveBin("0x0000000071727De22E5E9d8BAf0edAc6f37da032.bytecode"),
  },
  "0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108": {
    name: "entrypoint.v08",
    abi: resolveBin("0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108.abi"),
    bytecode: resolveBin("0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108.bytecode"),
  },
  "0x449ED7C3e6Fee6a97311d4b55475DF59C44AdD33": {
    name: "senderCreator.v08",
    abi: resolveBin("0x449ED7C3e6Fee6a97311d4b55475DF59C44AdD33.abi"),
    bytecode: resolveBin("0x449ED7C3e6Fee6a97311d4b55475DF59C44AdD33.bytecode"),
  },
  "0x433709009B8330FDa32311DF1C2AFA402eD8D009": {
    name: [ "entrypoint.v09", "entrypoint.latest" ],
    abi: resolveBin("0x433709009B8330FDa32311DF1C2AFA402eD8D009.abi"),
    bytecode: resolveBin("0x433709009B8330FDa32311DF1C2AFA402eD8D009.bytecode"),
  },
  "0x0A630a99Df908A81115A3022927Be82f9299987e": {
    name: [ "senderCreator.v09", "senderCreator.latest" ],
    abi: resolveBin("0x0A630a99Df908A81115A3022927Be82f9299987e.abi"),
    bytecode: resolveBin("0x0A630a99Df908A81115A3022927Be82f9299987e.bytecode"),
  },
  "0x000000000022D473030F116dDEE9F6B43aC78BA3": {
    name: "permit2",
    abi: resolveBin("0x000000000022D473030F116dDEE9F6B43aC78BA3.abi"),
    bytecode: resolveBin("0x000000000022D473030F116dDEE9F6B43aC78BA3.bytecode"),
  },
  "0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed": {
    name: "createx",
    abi: resolveBin("0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed.abi"),
    bytecode: resolveBin("0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed.bytecode"),
  },
  "0x4e59b44847b379578588920cA78FbF26c0B4956C": {
    name: "deployer.arachnid",
    abi: [],
    bytecode:
      "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3",
  },
  "0x7A0D94F55792C434d74a40883C6ed8545E406D12": {
    name: "deployer.micah",
    abi: [],
    bytecode: "0x60003681823780368234f58015156014578182fd5b80825250506014600cf3",
  },
  "0x0000F90827F1C53a10cb7A02335B175320002935": {
    name: "eip2935",
    abi: [],
    bytecode:
      "0x3373fffffffffffffffffffffffffffffffffffffffe14604657602036036042575f35600143038111604257611fff81430311604257611fff9006545f5260205ff35b5f5ffd5b5f35611fff60014303065500",
  },
};
