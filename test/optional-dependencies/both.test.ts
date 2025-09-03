import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createHardhatRuntimeEnvironment } from "hardhat/hre";
import hardhatPredeployPlugin from "../../src/index.js";

import disableDependencies from "../helpers/missing-loader.js";

describe("optional dependencies: both hardhat-ethers and hardhat-view are available", async () => {
  disableDependencies(); // Don't disable anything

  const { config, network } = await createHardhatRuntimeEnvironment({ plugins: [hardhatPredeployPlugin] });
  const connection = await network.connect();

  it("sanity", () => {
    assert.notEqual(connection.ethers, undefined);
    assert.notEqual(connection.viem, undefined);
  });

  it("connection.predeploy is populated", () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.predeploy)?.target, // ethers is default
        address,
      );
    }
  });
});
