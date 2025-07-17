import { extendConfig, extendEnvironment, task } from "hardhat/config";
import {
  TASK_NODE_SERVER_READY,
  TASK_TEST_SETUP_TEST_ENVIRONMENT,
} from "hardhat/builtin-tasks/task-names";
import { setCode } from "@nomicfoundation/hardhat-network-helpers";
import merge from "lodash.merge";

import { set } from "./types";
import { resolve } from "./config";
import defaultConfig from "./defaultConfig.json";

extendConfig((config, { predeploy: userConfig }) => {
  config.predeploy = resolve(merge(defaultConfig, userConfig));
});

extendEnvironment((hre) => {
  hre.predeploy = {};
});

task(TASK_NODE_SERVER_READY).setAction((_, env, runSuper) =>
  runSuper().then(() =>
    Promise.all(
      Object.entries(env.config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { name, abi, bytecode }]) =>
          setCode(address, bytecode)
            .then(() => env.ethers.getContractAt(abi, address))
            .then((instance) => set(env.predeploy, name, instance)),
        ),
    ),
  ),
);

task(TASK_TEST_SETUP_TEST_ENVIRONMENT).setAction((_, env, runSuper) =>
  runSuper().then(() =>
    Promise.all(
      Object.entries(env.config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { name, abi, bytecode }]) =>
          setCode(address, bytecode)
            .then(() => env.ethers.getContractAt(abi, address))
            .then((instance) => set(env.predeploy, name, instance)),
        ),
    ),
  ),
);
