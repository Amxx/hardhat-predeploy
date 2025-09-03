import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";

import { set } from "../types.js";

export default async (): Promise<Partial<NetworkHooks>> => ({
  newConnection: async <ChainTypeT extends ChainType | string>(
    context: HookContext,
    next: (nextContext: HookContext) => Promise<NetworkConnection<ChainTypeT>>,
  ): Promise<NetworkConnection<ChainTypeT>> => {
    const connection: NetworkConnection<ChainTypeT> = await next(context);

    connection.predeploy = {};
    await Promise.all(
      Object.entries(context.config.predeploy)
        .filter(([, details]) => details)
        .map(([address, { name, abi }]) =>
          connection.ethers.getContractAt(abi, address).then(instance => set(connection.predeploy!, name, instance)),
        ),
    );

    return connection;
  },
});
