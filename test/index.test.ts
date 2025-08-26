import hre from "hardhat";
import { expect } from "chai";

import "../src/type-extensions";

const connection = await hre.network.connect();

it("config is populated", async () => {
  expect(hre.config.predeploy).to.not.equal(undefined);
});

it("bytecode is deployed", async () => {
  for (const [address, { bytecode }] of Object.entries(hre.config.predeploy).filter(([, details]) => details)) {
    expect(await connection.provider.send("eth_getCode", [address])).to.equal(bytecode);
  }
});

it("disabled predeploys are not deployed", async () => {
  for (const [address] of Object.entries(hre.config.predeploy).filter(([, details]) => !details)) {
    expect(await connection.provider.send("eth_getCode", [address])).to.equal("0x");
  }
});

it("connection.predeploy is populated", () => {
  for (const [address, { name }] of Object.entries(hre.config.predeploy).filter(([, details]) => details)) {
    const contract = name.split(".").reduce((container, key) => container && container[key], connection.predeploy);
    expect(contract).to.not.equal(undefined);
    expect(contract?.target ?? contract?.address).to.equal(address);
  }
});

it("connection.ethers.predeploy is populated", () => {
  for (const [address, { name }] of Object.entries(hre.config.predeploy).filter(([, details]) => details)) {
    const contract = name.split(".").reduce((container, key) => container && container[key], connection.ethers?.predeploy);
    expect(contract).to.not.equal(undefined);
    expect(contract?.target).to.equal(address);
  }
});

it("connection.viem.predeploy is populated", () => {
  for (const [address, { name }] of Object.entries(hre.config.predeploy).filter(([, details]) => details)) {
    const contract = name.split(".").reduce((container, key) => container && container[key], connection.viem?.predeploy);
    expect(contract).to.not.equal(undefined);
    expect(contract?.address).to.equal(address);
  }
});