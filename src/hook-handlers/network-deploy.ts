import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";

export default async (): Promise<Partial<NetworkHooks>> => ({
  newConnection: async <ChainTypeT extends ChainType | string>(
    context: HookContext,
    next: (nextContext: HookContext) => Promise<NetworkConnection<ChainTypeT>>,
  ): Promise<NetworkConnection<ChainTypeT>> => {
    const connection: NetworkConnection<ChainTypeT> = await next(context);

    await connection.provider
      .request({ method: "web3_clientVersion" })
      .then(
        version =>
          version.toLowerCase().startsWith("hardhatnetwork") ||
          version.toLowerCase().startsWith("zksync") ||
          version.toLowerCase().startsWith("anvil"),
        () => false,
      )
      .then(
        isDevelopmentNetwork =>
          isDevelopmentNetwork &&
          Promise.all(
            Object.entries(context.config.predeploy)
              .filter(([, details]) => details)
              .map(([address, { bytecode }]) =>
                connection.provider.request({
                  method: "hardhat_setCode",
                  params: [address, bytecode],
                }),
              ),
          ),
      );

    return connection;
  },
});
