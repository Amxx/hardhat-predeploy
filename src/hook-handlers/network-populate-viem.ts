import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";
import { getContract } from "viem";

import { HexString, set } from "../types.js";

export default async (): Promise<Partial<NetworkHooks>> => ({
  newConnection: async <ChainTypeT extends ChainType | string>(
    context: HookContext,
    next: (nextContext: HookContext) => Promise<NetworkConnection<ChainTypeT>>,
  ): Promise<NetworkConnection<ChainTypeT>> => {
    const connection: NetworkConnection<ChainTypeT> = await next(context);

    connection.predeploy = {};
    await connection.viem.getPublicClient().then(client =>
      Promise.all(
        Object.entries(context.config.predeploy)
          .filter(([, details]) => details)
          .map(([address, { name, abi }]) =>
            set(connection.predeploy!, name, getContract({ address: address as HexString, abi, client })),
          ),
      ),
    );

    return connection;
  },
});
