import axios from "axios";
import { config } from "./config";
import { elizaLogger } from "@elizaos/core";

export interface ZoraCoin {
    coinId: number;
    name: string;
    description: string;
    imageUrl: string;
    jsonIpfsUrl: string;
    owner: string;
    address: string;
    symbol: string;
    txHash: string;
    payoutRecipient: string;
    platformReferrer: string;
    currency: string;
    pool: string;
    version: string;
    zoraCoinUrl: string;
}

const API_ENDPOINT = config.backend_url + "/api/zora-coins";

export async function saveZoraCoin(data: ZoraCoin): Promise<string> {
    try {
        const response = await axios.post(API_ENDPOINT, data);
        elizaLogger.info(
            `Save Zora Coin endpoint successfully invoked on ${data.name} and id ${data.coinId}`
        );
        return response.data;
    } catch (error) {
        elizaLogger.error(
            `Error invoking the save Zora Coin endpoint: ${error.message}`
        );
        throw error;
    }
}

export async function countZoraCoins(): Promise<number> {
    const countEndpoint = API_ENDPOINT + "/count";
    try {
        const response = await axios.get(countEndpoint);
        const count = response.data.data?.count;
        elizaLogger.info(
            `Count Zora Coins endpoint successfully invoked. ${count} Zora Coins found`
        );
        return count;
    } catch (error) {
        elizaLogger.error(
            `Error invoking the count Zora Coins endpoint: ${error.message}`
        );
        throw error;
    }
}
