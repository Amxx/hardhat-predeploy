/// <reference types="@nomicfoundation/hardhat-ethers" />

import test from "ava";
import hre from "hardhat";

test("Predeploy plugin", async (t) => {
  t.not(hre.predeploy, undefined);

  console.log(hre.predeploy);
  for (const [address, details] of Object.entries(hre.config.predeploy)) {
    if (details) {
      console.log(address, details.name);
      // t.is(await hre.ethers.provider.getCode(address), details.bytecode);
      // t.is(
      //   details.name
      //     .split(".")
      //     .reduce(
      //       (container: any, key: string) => container[key],
      //       hre.predeploy,
      //     ).target,
      //   address,
      // );
    } else {
      t.is(await hre.ethers.provider.getCode(address), "0x");
    }
  }
});
