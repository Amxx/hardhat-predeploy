import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";
import type { EthereumProvider } from "hardhat/types/providers";

import { set } from "../types.js";

async function checkIfDevelopmentNetwork(provider: EthereumProvider): Promise<boolean> {
  return (provider.request({ method: "web3_clientVersion" }) as Promise<string>).then(
    version =>
      version.toLowerCase().startsWith("hardhatnetwork") ||
      version.toLowerCase().startsWith("zksync") ||
      version.toLowerCase().startsWith("anvil"),
    () => false,
  );
}

async function deploy<ChainTypeT extends ChainType | string>(
  context: HookContext,
  connection: NetworkConnection<ChainTypeT>,
): Promise<void> {
  await Promise.all(
    Object.entries(context.config.predeploy)
      .filter(([, details]) => details)
      .map(([address, { bytecode }]) =>
        connection.provider.request({
          method: "hardhat_setCode",
          params: [address, bytecode],
        }),
      ),
  );
}

async function populate<ChainTypeT extends ChainType | string>(
  context: HookContext,
  connection: NetworkConnection<ChainTypeT>,
): Promise<void> {
  connection.predeploy = {};

  await Promise.all(
    Object.entries(context.config.predeploy)
      .filter(([, details]) => details)
      .map(([address, { name, abi, bytecode }]) =>
        connection.ethers.provider
          .getCode(address)
          .then(currentCode => currentCode == bytecode)
          .then(codeIsSet => (codeIsSet ? connection.ethers.getContractAt(abi, address) : undefined))
          .then(instance => instance && set(connection.predeploy, name, instance)),
      ),
  );
}

export default async (): Promise<Partial<NetworkHooks>> => ({
  newConnection: async <ChainTypeT extends ChainType | string>(
    context: HookContext,
    next: (nextContext: HookContext) => Promise<NetworkConnection<ChainTypeT>>,
  ): Promise<NetworkConnection<ChainTypeT>> => {
    const connection: NetworkConnection<ChainTypeT> = await next(context);
    if (await checkIfDevelopmentNetwork(connection.provider)) {
      await deploy(context, connection);
    }
    await populate(context, connection);
    return connection;
  },
});
