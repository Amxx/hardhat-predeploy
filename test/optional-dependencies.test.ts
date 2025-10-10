import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Contract } from "ethers";
import type { NestedContainer } from "../src/types.js";

import { createHardhatRuntimeEnvironment } from "hardhat/hre";
import hardhatEthersPlugin from "@nomicfoundation/hardhat-ethers";
import hardhatViemPlugin from "@nomicfoundation/hardhat-viem";
import hardhatPredeployPlugin from "../src/plugins/hardhat-predeploy.js";

describe("optional dependencies", async () => {
  for (const { name, installEthers, installViem } of [
    { name: "no optional dependency is available", installEthers: false, installViem: false },
    { name: "only hardhat-ethers is available", installEthers: true, installViem: false },
    { name: "only hardhat-viem is available", installEthers: false, installViem: true },
    { name: "both hardhat-ethers and hardhat-view are available", installEthers: true, installViem: true },
  ]) {
    describe(name, async () => {
      const { config, network } = await createHardhatRuntimeEnvironment({
        plugins: [
          ...(installEthers ? [hardhatEthersPlugin] : []),
          ...(installViem ? [hardhatViemPlugin] : []),
          hardhatPredeployPlugin,
        ],
      });
      const connection = await network.connect();

      it("sanity", () => {
        (installEthers ? assert.notEqual : assert.equal)(connection.ethers, undefined);
        (installViem ? assert.notEqual : assert.equal)(connection.viem, undefined);
      });

      it(`connection.ethers.predeploy is ${installEthers ? "populated" : "undefined"}`, () => {
        if (installEthers) {
          for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
            assert.equal(
              name
                .split(".")
                .reduce(
                  (container: NestedContainer<Contract>, key: string) => container?.[key],
                  connection.ethers.predeploy,
                )?.target,
              address,
            );
          }
        } else {
          assert.equal(connection.ethers, undefined);
        }
      });

      it(`connection.viem.predeploy is ${installEthers ? "populated" : "undefined"}`, () => {
        if (installViem) {
          for (const [address, { name }] of Object.entries(config.predeploy).filter(([, details]) => details)) {
            assert.equal(
              name
                .split(".")
                .reduce((container: NestedContainer<any>, key: string) => container?.[key], connection.viem.predeploy)
                ?.address,
              address,
            );
          }
        } else {
          assert.equal(connection.viem, undefined);
        }
      });
    });
  }
});
