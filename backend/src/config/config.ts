import "dotenv/config";

const requiredEnvVariables = [
  { key: "NEYNAR_API_KEY", message: "Make sure you set NEYNAR_API_KEY in your .env file" },
  { key: "SIGNER_UUID", message: "Make sure you set SIGNER_UUID in your .env file" },
  { key: "MONGO_URL", message: "Make sure you set MONGO_URL in your .env file" },
];

requiredEnvVariables.forEach(({ key, message }) => {
  if (!process.env[key]) {
    throw new Error(message);
  }
});

export const config = {
  mongodb_url: process.env.MONGO_URL,
  port: process.env.PORT || 3001,
  neynar_api_key: process.env.NEYNAR_API_KEY,
  signer_uuid: process.env.SIGNER_UUID,
  eliza_url: process.env.ELIZA_URL || "http://localhost:3000",
};
