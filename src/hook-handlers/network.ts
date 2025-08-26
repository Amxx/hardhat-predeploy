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
  if (connection.ethers) {
    connection.ethers.predeploy = {};
    await Promise.all(
      Object.entries(context.config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { name, abi }]) =>
          connection.ethers!.getContractAt(abi, address).then(instance => set(connection.ethers!.predeploy, name, instance)),
        ),
    );
  }
  if (connection.viem) {
    connection.viem.predeploy = {};
    const { getContract } = await import("viem");
    await connection.viem.getPublicClient().then(client =>
      Promise.all(
        Object.entries(context.config.predeploy)
          .filter(([, details]) => details)
          .map(([address, { name, abi }]) =>
            set(connection.viem!.predeploy, name, getContract({ address: address as HexString, abi, client })),
          ),
      )
    );
  }
  connection.predeploy = connection.ethers?.predeploy ?? connection.viem?.predeploy;
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
