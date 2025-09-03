import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createHardhatRuntimeEnvironment } from "hardhat/hre";
import hardhatPredeployPlugin from "../src/index.js";

describe("hardhat-predeploy plugin", async () => {
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
