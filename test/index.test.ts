import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createHardhatRuntimeEnvironment } from "hardhat/hre";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import hardhatPredeployPlugin from "../src/index.js";

describe("hardhat-predeploy alone", async () => {
  const { config, network } = await createHardhatRuntimeEnvironment({ plugins: [hardhatPredeployPlugin] });
  const connection = await network.connect();

  describe("config", () => {
    it("config.predeploy is populated", async () => {
      assert.notEqual(config.predeploy, undefined);
    });
  });

  describe("network", () => {
    it("predeploy's bytecode is deployed", async () => {
      for (const [address, { bytecode }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
        assert.equal(
          await connection.provider.request({
            method: "eth_getCode",
            params: [address],
          }),
          bytecode,
        );
      }
    });

    it("disabled predeploys are not deployed", async () => {
      for (const [address] of Object.entries(config.predeploy).filter(([, details]) => !details)) {
        assert.equal(
          await connection.provider.request({
            method: "eth_getCode",
            params: [address],
          }),
          "0x",
        );
      }
    });
  });
});

describe("hardhat-predeploy + ethers", async () => {
  const { config, network } = await createHardhatRuntimeEnvironment({
    plugins: [hardhatEthers, hardhatPredeployPlugin],
  });
  const connection = await network.connect();

  it("connection.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(name.split(".").reduce((container, key) => container?.[key], connection.predeploy)?.target, address);
    }
  });

  it("connection.ethers.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.ethers.predeploy)?.target,
        address,
      );
    }
  });

  it("connection.viem.predeploy is not populated", () => {
    assert.equal(connection.viem, undefined);
  });
});

describe("hardhat-predeploy + viem", async () => {
  const { config, network } = await createHardhatRuntimeEnvironment({ plugins: [hardhatViem, hardhatPredeployPlugin] });
  const connection = await network.connect();

  it("connection.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.predeploy)?.address,
        address,
      );
    }
  });

  it("connection.viem.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.viem.predeploy)?.address,
        address,
      );
    }
  });

  it("connection.ethers.predeploy is not populated", () => {
    assert.equal(connection.ethers, undefined);
  });
});

describe("hardhat-predeploy + ethers + viem", async () => {
  const { config, network } = await createHardhatRuntimeEnvironment({
    plugins: [hardhatEthers, hardhatViem, hardhatPredeployPlugin],
  });
  const connection = await network.connect();

  it("connection.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.predeploy)?.target, // ethers takes priority here
        address,
      );
    }
  });

  it("connection.ethers.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.ethers.predeploy)?.target,
        address,
      );
    }
  });

  it("connection.viem.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.viem.predeploy)?.address,
        address,
      );
    }
  });
});
