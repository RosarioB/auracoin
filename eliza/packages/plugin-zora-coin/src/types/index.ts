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
    name: z.string().refine(val => val.trim().length > 0, "Name cannot be blank"),
    description: z.string().refine(val => val.trim().length > 0, "Description cannot be blank"),
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
    const result = ZoraCoinSchema.safeParse(object);
    if (result.success) {
        return true;
    }
    elizaLogger.error("Validation error: ", result.error.format());
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
    hash: string;
    from: string;
    to: string;
    tokenUri: string;
    imageUrl: string;
    name: string;
    description: string;
    symbol: string;
    address: string;
    coinId: number;
    zoraCoinUrl: string;
}
