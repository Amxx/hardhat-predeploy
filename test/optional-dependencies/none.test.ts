import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createHardhatRuntimeEnvironment } from "hardhat/hre";
import hardhatPredeployPlugin from "../../src/index.js";

import disableDependencies from "../helpers/missing-loader.js";

describe("optional dependencies: no optional dependency is available", async () => {
  disableDependencies("@nomicfoundation/hardhat-ethers", "@nomicfoundation/hardhat-viem");

  const { network } = await createHardhatRuntimeEnvironment({ plugins: [hardhatPredeployPlugin] });
  const connection = await network.connect();

  it("sanity", () => {
    assert.equal(connection.ethers, undefined);
    assert.equal(connection.viem, undefined);
  });

  it("connection.predeploy is undefined", () => {
    assert.equal(connection.predeploy, undefined);
  });
});
