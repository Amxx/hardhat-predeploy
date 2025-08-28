import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createHardhatRuntimeEnvironment } from "hardhat/hre";
import hardhatPredeployPlugin from "../../src/index.js";

import disableDependencies from '../helpers/missing-loader.js';

describe("optional dependencies: only hardhat-viem is available", async () => {
  disableDependencies('@nomicfoundation/hardhat-ethers');

  const { config, network } = await createHardhatRuntimeEnvironment({ plugins: [hardhatPredeployPlugin] });
  const connection = await network.connect();

  it("sanity", () => {
    assert.equal(connection.ethers, undefined);
    assert.notEqual(connection.viem, undefined);
  });

  it('connection.predeploy is populated', () => {
    for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
      assert.equal(
        name.split(".").reduce((container, key) => container?.[key], connection.predeploy)?.address,
        address,
      );
    }
  });
});