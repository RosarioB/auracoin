import {
    type Action,
    composeContext,
    generateObjectDeprecated,
    type HandlerCallback,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
} from "@elizaos/core";

import {
    initWalletProvider,
    SupportedChain,
    type WalletProvider,
} from "@elizaos-plugins/plugin-evm";
import type {
    ZoraCoinMintingParams,
    ZoraCoinMintingTransaction,
} from "../types/index.js";
import { isZoraCoinMintingContent, ZoraCoinMintingContent } from "../types/index.js";
import { ZORA_COIN_MINTING_TEMPLATE } from "../templates/zoraCoinMintingTemplate.js";
import { generateAiImage } from "../lib/imageGeneration.js";
import { validateImageGenConfig } from "@elizaos-plugins/plugin-image-generation";
import { uploadJsonToPinata } from "../lib/pinata.js";
import { config } from "../lib/config.js";
import { saveZoraCoin, countZoraCoins } from "../lib/api.js";
import { getChainKeyById, getRecipientAddress } from "../lib/utils.js";
import { createCoin, CreateCoinArgs } from "@zoralabs/coins-sdk";

export class ZoraCoinMintingAction {
    private currentChainKey: SupportedChain;

    constructor(private walletProvider: WalletProvider) {
        this.currentChainKey = getChainKeyById(
            walletProvider.getCurrentChain().id
        );
    }

    getCurrentChainKey(): SupportedChain {
        return this.currentChainKey;
    }

    async mint(params: ZoraCoinMintingParams): Promise<ZoraCoinMintingTransaction> {
        elizaLogger.info(
            `Minting Zora Coin with TokenURI ${params.jsonHash} to ${params.recipient}`
        );
        const currentChain = this.walletProvider.getCurrentChain();
        const account = this.walletProvider.account;
        const walletClient = this.walletProvider.getWalletClient(
            this.currentChainKey
        );

        const publicClient = this.walletProvider.getPublicClient(this.currentChainKey);
        const imageUrl = `https://${config.pinata_gateway_url}/ipfs/${params.imageHash}`;
        const jsonUrl = `ipfs://${params.jsonHash}`;
        const coinId = (await countZoraCoins()) + 1;
        const symbol = "AURA";

        try {
            const coinParams: CreateCoinArgs = {
                name: params.name,
                symbol,
                uri: jsonUrl,
                payoutRecipient: params.recipient as `0x${string}`,
                platformReferrer: account.address,
                owners: [params.recipient as `0x${string}`],
            };
            
            elizaLogger.info(`Coin params: ${JSON.stringify(coinParams)}`);

            const result = await createCoin(coinParams, walletClient, publicClient);
            const zoraCoinUrl = `https://zora.co/coin/base:${result.address}`

            elizaLogger.info(
                `Successfully minted Zora Coin of name ${params.name} and id ${coinId} and address ${result.address}.`
            );
            await saveZoraCoin({
                coinId,
                name: params.name,
                description: params.description,
                imageUrl: imageUrl,
                jsonIpfsUrl: jsonUrl,
                owner: account.address,
                address: result.address,
                symbol: result.deployment.symbol,
                txHash: result.hash,
                payoutRecipient: result.deployment.payoutRecipient,
                platformReferrer: result.deployment.platformReferrer,
                currency: result.deployment.currency,
                pool: result.deployment.pool,
                version: result.deployment.version,
                zoraCoinUrl: zoraCoinUrl,
            });

            return {
                hash: result.hash,
                from: walletClient.account.address,
                to: params.recipient,
                tokenUri: params.jsonHash,
                imageUrl,
                name: params.name,
                description: params.description,
                symbol,
                address: result.address,
                coinId,
            };
        } catch (error) {
            throw new Error(
                `Error during minting the Zora Coin: ${error.message}`
            );
        }
    }
}

const buildZoraCoinMintingDetails = async (
    state: State,
    runtime: IAgentRuntime,
    wp: WalletProvider
): Promise<ZoraCoinMintingContent> => {
    const chains = Object.keys(wp.chains);
    state.supportedChains = chains.map((item) => `"${item}"`).join("|");

    const context = composeContext({
        state,
        template: ZORA_COIN_MINTING_TEMPLATE,
    });

    const promptZoraCoinDetails = (await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    })) as ZoraCoinMintingContent;

    return promptZoraCoinDetails;
};

export const zoraCoinMintingAction: Action = {
    name: "MINT_ZORA_COIN",
    similes: ["MINT_TOKEN", "CREATE_TOKEN", "BUILD_TOKEN", "MINT_COIN", "CREATE_COIN"],
    description: "Mints Zora Coins",
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        const isPrivateKeyValid =
            typeof privateKey === "string" && privateKey.startsWith("0x");

        await validateImageGenConfig(runtime);

        const anthropicApiKeyOk = !!runtime.getSetting("ANTHROPIC_API_KEY");
        const nineteenAiApiKeyOk = !!runtime.getSetting("NINETEEN_AI_API_KEY");
        const togetherApiKeyOk = !!runtime.getSetting("TOGETHER_API_KEY");
        const heuristApiKeyOk = !!runtime.getSetting("HEURIST_API_KEY");
        const falApiKeyOk = !!runtime.getSetting("FAL_API_KEY");
        const openAiApiKeyOk = !!runtime.getSetting("OPENAI_API_KEY");
        const veniceApiKeyOk = !!runtime.getSetting("VENICE_API_KEY");
        const livepeerGatewayUrlOk = !!runtime.getSetting(
            "LIVEPEER_GATEWAY_URL"
        );

        const isApiImageGenerationValid =
            anthropicApiKeyOk ||
            togetherApiKeyOk ||
            heuristApiKeyOk ||
            falApiKeyOk ||
            openAiApiKeyOk ||
            veniceApiKeyOk ||
            nineteenAiApiKeyOk ||
            livepeerGatewayUrlOk;

        return isPrivateKeyValid && isApiImageGenerationValid;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback?: HandlerCallback
    ) => {
        let currentState = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        currentState.currentMessage = `${currentState.recentMessagesData[1].content.text}`;

        elizaLogger.info("ZoraCoinMinting action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const action = new ZoraCoinMintingAction(walletProvider);

        const extractedData = await buildZoraCoinMintingDetails(
            currentState,
            runtime,
            walletProvider
        );

        elizaLogger.info(`Extracted data: ${JSON.stringify(extractedData)}`);

        if (!isZoraCoinMintingContent(extractedData)) {
            elizaLogger.error("Invalid content for MINT_ZORA_COIN action.");
            callback({
                text: "Invalid ZoraCoinMinting details. Ensure name, description, and recipient are correctly specified.",
                content: { error: "Invalid mint Zora Coin content" },
            });
            return false;
        }

        elizaLogger.info(`Validated JSON: ${JSON.stringify(extractedData)}`);

        const recipient = extractedData.recipient.trim();
        const recipientAddress = await getRecipientAddress(
            recipient,
            walletProvider
        );

        // DA RIATTIVARE
        /* const imageHash = await generateAiImage(
            runtime,
            extractedData.description
        );
        const jsonHash = await uploadJsonToPinata(
            extractedData.name || "",
            extractedData.description,
            imageHash
        ); */

        const jsonHash = "bafkreigfekxuwzzywgvq7l4c6tfyimr4gmye6drqhsyl3e3hbdzilqeniq";
        const imageHash = "bafybeic6f2btpoueqkbps5bhzcb5ria4umv5tu5bzvhwdgjyrjprwk5wgq";

        const zoraCoinMintingParams: ZoraCoinMintingParams = {
            jsonHash,
            recipient: recipientAddress,
            name: extractedData.name,
            description: extractedData.description,
            imageHash,
        };

        try {
            const transferResp = await action.mint(zoraCoinMintingParams);
            const currentChain = walletProvider.getCurrentChain();
            const txUrl = `${currentChain.blockExplorers.default.url}/tx/${transferResp.hash}`;

            if (callback) {
                callback({
                    text: `Successfully minted the Zora Coin of ${extractedData.description} to ${recipient}. Check out the transaction: ${txUrl}`,
                    content: {
                        success: true,
                        hash: transferResp.hash,
                        recipientAddress,
                        recipient: recipient,
                        tokenUri: transferResp.tokenUri,
                        imageUrl: transferResp.imageUrl,
                        txUrl: txUrl,
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during minting the Zora Coin:", error.message);
            if (callback) {
                callback({
                    text: `Error minting the Zora Coin: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "@auracoin Send a golden cat to 0x742d35Cc6634C0532925a3b844Bc454e4438f445",
                    action: "MINT_ZORA_COIN",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully minted Zora Coin of ID 1 to 0x742d35Cc6634C0532925a3b844Bc454e4438f445. Check the transaction at this URL:https://sepolia.basescan.org/tx/0x625f1ccf068bb71c5b0a385297f7a0bfa5a32b23f4d08c3e2c41158ac468e3a2 ---imageUrl:https://apricot-obvious-xerinae-783.mypinata.cloud/ipfs/bafybeidwnwsaadwtoregkjdfvaivmaslxragxzkjwk2zgp7jkw4th2xzm6---",
                    action: "MINT_ZORA_COIN",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "@auracoin Send a cake to @someaccount",
                    action: "MINT_ZORA_COIN",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully minted Zora Coin of ID 2 to @someaccount. Check the transaction at this URL:https://sepolia.basescan.org/tx/0x625f1ccf068bb71c5b0a385297f7a0bfa5a32b23f4d08c3e2c41158ac468e3a2 ---imageUrl:https://apricot-obvious-xerinae-783.mypinata.cloud/ipfs/bafybeidwnwsaadwtoregkjdfvaivmaslxragxzkjwk2zgp7jkw4th2xzm6---",
                    action: "MINT_ZORA_COIN",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "@auracoin Create a fabolus car and send it to vitalik.eth",
                    action: "MINT_ZORA_COIN",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully minted Zora Coin of ID 3 to vitalik.eth. Check the transaction at this URL:https://sepolia.basescan.org/tx/0x625f1ccf068bb71c5b0a385297f7a0bfa5a32b23f4d08c3e2c41158ac468e3a2 ---imageUrl:https://apricot-obvious-xerinae-783.mypinata.cloud/ipfs/bafybeidwnwsaadwtoregkjdfvaivmaslxragxzkjwk2zgp7jkw4th2xzm6---",
                    action: "MINT_ZORA_COIN",
                },
            },
        ],
    ],
};
