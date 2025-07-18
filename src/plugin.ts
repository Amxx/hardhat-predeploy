import { extendConfig, extendEnvironment, task } from "hardhat/config";
import type { EIP1193Provider, HardhatRuntimeEnvironment } from "hardhat/types";
import {
  TASK_NODE_SERVER_READY,
  TASK_RUN,
  TASK_TEST_SETUP_TEST_ENVIRONMENT,
} from "hardhat/builtin-tasks/task-names";

import { resolveWithDefault } from "./config";
import { set } from "./types";

extendConfig((config, { predeploy: userConfig }) => {
  config.predeploy = resolveWithDefault(userConfig);
});

extendEnvironment((hre) => {
  hre.predeploy = {};
});

/// NOTE: this approach doesn't work in coverage mode.
// extendProvider(async (provider, config /*network*/) => {
//   const isDev = await checkIfDevelopmentNetwork(provider);
//   if (isDev) {
//     await Promise.all(
//       Object.entries(config.predeploy)
//         .filter(([, details]) => details)
//         .map(([address, { bytecode }]) =>
//           provider.request({
//             method: "hardhat_setCode",
//             params: [address, bytecode],
//           }),
//         ),
//     );
//   }
//   return provider;
// });

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

async function deployAndSetEnv(env: HardhatRuntimeEnvironment) {
  const isDev = await checkIfDevelopmentNetwork(env.network.provider);
  if (isDev) {
    await Promise.all(
      Object.entries(env.config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { name, abi, bytecode }]) =>
          env.network.provider
            .request({
              method: "hardhat_setCode",
              params: [address, bytecode],
            })
            .then(() => env.ethers.getContractAt(abi, address))
            .then((instance) => set(env.predeploy, name, instance)),
        ),
    );
  }
}

task(TASK_NODE_SERVER_READY).setAction((_, env, runSuper) =>
  runSuper().then(() => deployAndSetEnv(env)),
);

task(TASK_RUN).setAction((_, env, runSuper) =>
  runSuper().then(() => deployAndSetEnv(env)),
);

task(TASK_TEST_SETUP_TEST_ENVIRONMENT).setAction((_, env, runSuper) =>
  runSuper().then(() => deployAndSetEnv(env)),
);
