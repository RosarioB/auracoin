import mongoose, { Schema, Document, Model } from "mongoose";

export interface ZoraCoin extends Document {
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

const zoraCoinSchema: Schema = new Schema(
  {
    coinId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    jsonIpfsUrl: { type: String, required: true },
    owner: { type: String, required: true },
    address: { type: String, required: true },
    symbol: { type: String, required: true },
    txHash: { type: String, required: true },
    payoutRecipient: { type: String, required: true },
    platformReferrer: { type: String, required: true },
    currency: { type: String, required: true },
    pool: { type: String, required: true },
    version: { type: String, required: true },
    zoraCoinUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const ZoraCoinModel: Model<ZoraCoin> = mongoose.model<ZoraCoin>("ZoraCoin", zoraCoinSchema);
