import axios from "axios";
import { config } from "./config";
import { elizaLogger } from "@elizaos/core";

export interface ZoraCoin {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    jsonIpfsUrl: string;
    owner: string;
    createdAt?: Date;
}

export async function createZoraCoin(data: ZoraCoin): Promise<string> {
    const endpoint = config.backend_url + "/api/zora-coins";

    try {
        const response = await axios.post(endpoint, data);
        elizaLogger.info(
            `[${new Date().toISOString()}] Create Zora Coin endpoint successfully invoked`
        );
        return response.data;
    } catch (error) {
        elizaLogger.error(
            `[${new Date().toISOString()}] Error invoking the create Zora Coin endpoint: ${
                error.message
            }`
        );
        throw error;
    }
}
