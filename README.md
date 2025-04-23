# Auracoin
This is AuraCoin: a Farcaster agent that creates Zora Coins using AI-generated images from DALL·E. The agent is powered by Eliza, stores the images on IPFS via Pinata, and mints the coins on Base.

You can invoke Auracoin on Farcaster by casting:

```
@auracoin Send a golden sports car with red stripes to 0x20c6F9006d563240031A1388f4f25726029a6368  

@auracoin Send a golden sports car with red stripes to @rosarioborgesi  

@auracoin Send a golden sports car with red stripes to vitalik.eth
```
## Demo
The project demo is available on [Youtube](https://www.youtube.com/watch?v=2wsWVNRtdg8)

## Docker
Start the MongoDB container:
```
cd /auracoin/docker/test
docker-compose up -d
```

To stop the container:
```
docker-compose down
```

## Backend
- **Project Setup**: `pnpm i`

- **Run Prisma**: `npx prisma generate`

- **Environment Variables**: Create a `.env` file with the following:

    ```
    ELIZA_URL=<your-eliza-url>
    MONGO_URL=<your-mongo-db-url> (i.e: mongodb://root:root@localhost:27017)
    NEYNAR_API_KEY=<your-neynar-api-key>
    SIGNER_UUID=<your-signer-uuid>
    ```

- **Start in Development Mode**: `pnpm run dev`

- **Start in Production Mode**: `pnpm run start`

## Eliza Agent
- **Project Setup**: `pnpm i && pnpm build`

- **Environment Variables**: Add the following to the `.env` file:

    ```
    BACKEND_URL=<your-backend-url>
    ETHEREUM_PROVIDER_BASE=<your-ethereum-provider-basese>
    EVM_PRIVATE_KEY=<your-evm-private-key>
    NEYNAR_API_KEY=<your-neynar-api-key>
    OPENAI_API_KEY=<your-openai-api-key>
    PINATA_GATEWAY_URL=<your-pinata-gateway-url>
    PINATA_JWT=<your-pinata-jwt>
    ```

- **Start in Development Mode**: `pnpm run dev`

- **Start in Production Mode**: `pnpm run start`
