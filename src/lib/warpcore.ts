import { chainMetadata, eclipsemainnet, eclipsemainnetAddresses, warpRouteConfigs, solanamainnet, solanamainnetAddresses, sonicsvm, sonicsvmAddresses } from "@hyperlane-xyz/registry";
import { ChainMap, ChainMetadata, MultiProtocolProvider, WarpCore } from "@hyperlane-xyz/sdk";
import { Address } from "viem";

const chains: ChainMap<ChainMetadata & { mailbox?: Address }> = {
    solanamainnet: {
        ...solanamainnet,
        mailbox: solanamainnetAddresses.mailbox as Address,
    },
    sonicsvm: {
        ...chainMetadata.sonicsvm,
    },
};
const multiProvider = new MultiProtocolProvider(chains);
export const warpCore = WarpCore.FromConfig(multiProvider, {
    tokens: warpRouteConfigs["SOL/solanamainnet-sonicsvm"].tokens,
});