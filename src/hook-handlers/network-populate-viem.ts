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

    connection.viem.predeploy = {};
    await connection.viem.getPublicClient().then(client =>
      Promise.all(
        Object.entries(context.config.predeploy.alias).map(
          ([name, address]) =>
            address !== false &&
            context.config.predeploy.artifacts[address] !== false &&
            set(
              connection.viem.predeploy,
              name,
              getContract({
                address: address as HexString,
                abi: context.config.predeploy.artifacts[address].abi,
                client,
              }),
            ),
        ),
      ),
    );

    return connection;
  },
});
