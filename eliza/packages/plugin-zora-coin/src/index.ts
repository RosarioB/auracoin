import type { Plugin } from "@elizaos/core";
import { zoraCoinMintingAction } from "./actions/zoraCoinMinting.ts";

export * as actions from "./actions/index.ts";
export * from "./types/index.ts";

export const zoraCoinPlugin: Plugin = {
    name: "zora-coin",
    description: "Mints Zora Coins with AI generated images",
    actions: [zoraCoinMintingAction],
    evaluators: [],
    providers: [],
};
export default zoraCoinPlugin;
