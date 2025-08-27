import { config, network } from "hardhat";
import { expect } from "chai";
import { it } from "mocha";

import "../src/type-extensions";

const connection = await network.connect();

describe('config', () => {
  it("config.predeploy is populated", async () => {
    expect(config.predeploy).to.not.equal(undefined);
  });
});

describe('network', () => {
  it("predeploy's bytecode is deployed", async () => {
    for (const [address, { bytecode }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      expect(await connection.provider.send("eth_getCode", [address])).to.equal(bytecode);
    }
  });

  it("disabled predeploys are not deployed", async () => {
    for (const [address] of Object.entries(config.predeploy).filter(([, details]) => !details)) {
      expect(await connection.provider.send("eth_getCode", [address])).to.equal("0x");
    }
  });
});

describe('contracts', () => {
  it("connection.predeploy is populated", () => {
    expect(connection.predeploy).to.not.equal(undefined);
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      const contract = name.split(".").reduce((container, key) => container && container[key], connection.predeploy);
      expect(contract).to.not.equal(undefined);
      expect(contract?.target ?? contract?.address).to.equal(address);
    }
  });

  it("connection.ethers.predeploy is populated", () => {
    expect(connection.ethers?.predeploy).to.not.equal(undefined);
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      const contract = name.split(".").reduce((container, key) => container && container[key], connection.ethers?.predeploy);
      expect(contract).to.not.equal(undefined);
      expect(contract?.target).to.equal(address);
    }
  });

  it("connection.viem.predeploy is populated", () => {
    expect(connection.viem?.predeploy).to.not.equal(undefined);
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      const contract = name.split(".").reduce((container, key) => container && container[key], connection.viem?.predeploy);
      expect(contract).to.not.equal(undefined);
      expect(contract?.address).to.equal(address);
    }
  });
});
