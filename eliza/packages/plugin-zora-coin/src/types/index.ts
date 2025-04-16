import { elizaLogger } from "@elizaos/core";
import * as viemChains from "viem/chains";
import { z } from "zod";

const _SupportedChainList = Object.keys(viemChains) as Array<
    keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

export interface ZoraCoinMintingContent {
    name: string;
    description: string;
    recipient: string;
}

export const ZoraCoinSchema = z.object({
    name: z.string(),
    description: z.string(),
    recipient: z.string().refine(
        (value) =>
            /^0x[a-fA-F0-9]{40}$/.test(value) || 
            value.startsWith("@") ||
            value.endsWith(".eth"),
        {
            message: "Recipient must be a valid Ethereum address, Farcaster handle, or ENS domain",
        }
    ),
});

export const isZoraCoinMintingContent = (object: any): object is ZoraCoinMintingContent => {
    if (ZoraCoinSchema.safeParse(object).success) {
        return true;
    }
    elizaLogger.error("Invalid content: ", object);
    return false;
};

export interface ZoraCoinMintingParams {
    jsonHash: string;
    recipient: string;
    name: string;
    description: string;
    imageHash: string;
}

export interface ZoraCoinMintingTransaction {
    id: string;
    hash: string;
    from: string;
    to: string;
    tokenUri: string;
    imageUrl: string;
}
