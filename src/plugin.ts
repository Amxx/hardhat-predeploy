import {
  extendConfig,
  extendEnvironment,
  extendProvider,
  task,
} from "hardhat/config";
import type { EIP1193Provider } from "hardhat/types";
import {
  TASK_RUN,
  TASK_TEST_SETUP_TEST_ENVIRONMENT,
} from "hardhat/builtin-tasks/task-names";

import { resolveWithDefault } from "./config";
import { set } from "./types";

async function checkIfDevelopmentNetwork(
  provider: EIP1193Provider,
): Promise<boolean> {
  return (
    provider.request({ method: "web3_clientVersion" }) as Promise<string>
  ).then(
    (version) =>
      version.toLowerCase().startsWith("hardhatnetwork") ||
      version.toLowerCase().startsWith("zksync") ||
      version.toLowerCase().startsWith("anvil"),
    () => false,
  );
}

extendConfig((config, { predeploy: userConfig }) => {
  config.predeploy = resolveWithDefault(userConfig);
});

extendEnvironment((hre) => {
  hre.predeploy = {};
});

extendProvider(async (provider, config /*network*/) => {
  const isDev = await checkIfDevelopmentNetwork(provider);
  if (isDev) {
    await Promise.all(
      Object.entries(config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { bytecode }]) =>
          provider.request({
            method: "hardhat_setCode",
            params: [address, bytecode],
          }),
        ),
    );
  }
  return provider;
});

task(TASK_RUN).setAction((_, env, runSuper) =>
  runSuper().then(async () => {
    const isDev = await checkIfDevelopmentNetwork(env.network.provider);
    if (isDev) {
      await Promise.all(
        Object.entries(env.config.predeploy)
          .filter(([, details]) => details)
          .map(([address, { name, abi }]) =>
            env.ethers
              .getContractAt(abi, address)
              .then((instance) => set(env.predeploy, name, instance)),
          ),
      );
    }
  }),
);

task(TASK_TEST_SETUP_TEST_ENVIRONMENT).setAction((_, env, runSuper) =>
  runSuper().then(async () => {
    const isDev = await checkIfDevelopmentNetwork(env.network.provider);
    if (isDev) {
      await Promise.all(
        Object.entries(env.config.predeploy)
          .filter(([, details]) => details)
          .map(([address, { name, abi }]) =>
            env.ethers
              .getContractAt(abi, address)
              .then((instance) => set(env.predeploy, name, instance)),
          ),
      );
    }
  }),
);
