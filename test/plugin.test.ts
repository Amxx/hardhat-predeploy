import hre from "hardhat";
import { expect } from "chai";

import "../src/type-extensions";

it("bytecode is deployed", async () => {
  for (const [address, { bytecode }] of Object.entries(hre.config.predeploy).filter(([, details]) => details)) {
    expect(await hre.ethers.provider.getCode(address)).to.equal(bytecode);
  }
});

it("disabled predeploys are not deployed", async () => {
  for (const [address] of Object.entries(hre.config.predeploy).filter(([, details]) => !details)) {
    expect(await hre.ethers.provider.getCode(address)).to.equal("0x");
  }
});

it("hre.predeploy is populated", () => {
  for (const [address, { name }] of Object.entries(hre.config.predeploy).filter(([, details]) => details)) {
    const contract = name.split(".").reduce((container, key) => container && container[key], hre.predeploy);
    expect(contract?.target).to.equal(address);
  }
});
