import { createCoin, CreateCoinArgs } from "@zoralabs/coins-sdk";
import { elizaLogger } from "@elizaos/core";
import { config } from "./config.js";

/**
 * Creates a Zora coin with retry logic for metadata fetch failures
 * @param coinParams The coin parameters
 * @param walletClient The wallet client
 * @param publicClient The public client
 * @param jsonHash The JSON hash for retry with HTTPS URI
 * @returns The result of the coin creation
 */
export async function createCoinWithRetry(
    coinParams: CreateCoinArgs, 
    walletClient: any, 
    publicClient: any, 
    jsonHash: string
): Promise<any> {
    try {
        return await createCoin(coinParams, walletClient, publicClient);
    } catch (error) {
        if (error.message && error.message.includes("Metadata fetch failed")) {
            elizaLogger.error("Metadata fetch failed. Retrying with HTTPS URI");
            const httpsURI = `https://${config.pinata_gateway_url}/ipfs/${jsonHash}`;
            
            // Update the URI in the existing coinParams object
            coinParams.uri = httpsURI;
            elizaLogger.info(`Updated coin params: ${JSON.stringify(coinParams)}`);
            return await createCoin(coinParams, walletClient, publicClient);
        } else {
            throw error;
        }
    }
} 