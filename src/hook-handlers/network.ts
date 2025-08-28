import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";
import type { EthereumProvider } from "hardhat/types/providers";

import { HexString, set } from "../types.js";

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
  if (connection.ethers) {
    await Promise.all(
      Object.entries(context.config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { name, abi }]) =>
          connection.ethers!.getContractAt(abi, address).then(instance => set(connection.predeploy, name, instance)),
        ),
    );
  } else if (connection.viem) {
    const { getContract } = await import("viem");
    await connection.viem.getPublicClient().then(client =>
      Promise.all(
        Object.entries(context.config.predeploy)
          .filter(([, details]) => details)
          .map(([address, { name, abi }]) =>
            set(connection.predeploy, name, getContract({ address: address as HexString, abi, client })),
          ),
      ),
    );
  }
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
