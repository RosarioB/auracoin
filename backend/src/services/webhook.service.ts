import { config } from "../config/config.js";
import neynarClient from "../lib/neynar.js";
import agentService from "./agent.service.js";
import { WebhookEvent } from "../types/webhookEvent.types.js";
import { AgentResponse, AgentResponseData } from "../types/agent.types.js";
import { PostCastResponse } from "@neynar/nodejs-sdk/build/api/index.js";
import { errorWithTimestamp, logWithTimestamp } from "../utils/logging.js";

class WebhookService {
  private agentId: string;

  constructor() {
    this.agentId = "";
  }

  async initialize() {
    this.agentId = await agentService.fetchAgent();
    logWithTimestamp(`WebhookService initialized with agentId: ${this.agentId}`);
  }

  async handleMention(event: WebhookEvent) {
    const webhookData = event.data;
    if (!webhookData) {
      throw new Error("Invalid webhook data.");
    }
    const text = webhookData.text;
    if (!text) {
      throw new Error("Invalid or missing text in webhook data.");
    }
    if (!text.toLowerCase().trim().startsWith("@auracoin")) {
      throw new Error(
        "The text does not start with @auracoin, it's not a mention."
      );
    }
    logWithTimestamp(`Received mention: ${text}`);
    //logWithTimestamp(util.inspect(data, { depth: null, colors: true }));
    
    if (!this.agentId) {
      await this.initialize();
    }
    
    const agentResponse = (await agentService.sendMessageToAgent(
      this.agentId,
      text
    )) as AgentResponse;

    const responseData = agentResponse.data;
    const mintData = responseData.find((item) =>
      item.text.startsWith("Successfully minted Zora Coin")
    );
    this.validateData(mintData);
    logWithTimestamp(`Agent response data: ${JSON.stringify(mintData)}`);

    const author = webhookData.author.username;
    const parentCastHash = webhookData.hash;
    const textToPublish = `@${author} ${mintData.text}`;
    const castResponse = await this.publishCast({
      text: textToPublish,
      zoraCoinUrl: mintData.content.zoraCoinUrl,
      parentCastHash
    }
    );
    return castResponse;
  }

  private validateData(mintData: AgentResponseData) {
    if (!mintData) {
      throw new Error("No successfully minted ZoraCoin data found.");
    }
    if (!mintData.text || !mintData.content.zoraCoinUrl) {
      throw new Error("Mint data text or Zora Coin Url is missing.");
    }
  }

  async publishCast(
    castData: { text: string; zoraCoinUrl: string; parentCastHash: string }
  ): Promise<PostCastResponse> {
    try {
      const neynarResponse = await neynarClient.publishCast({
        signerUuid: config.signer_uuid,
        text: castData.text,
        parent: castData.parentCastHash,
        embeds: [
          {
            url: castData.zoraCoinUrl,
          },
        ],
      });
      logWithTimestamp(
        `Published cast: ${castData.text} \nEmbedded Zora Coin URL ${castData.zoraCoinUrl}`
      );
      return neynarResponse;
    } catch (error) {
      errorWithTimestamp(`Failed to publish cast`, error);
      throw error;
    }
  }
}

const webhookService = new WebhookService();
webhookService.initialize().catch(error => {
  errorWithTimestamp("Failed to initialize WebhookService", error);
});

export default webhookService;
