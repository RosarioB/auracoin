import { Router } from "express";
import zoraCoinRoute from "./zoraCoin.routes.js";
import webhookRoute from "./webhook.routes.js";

const indexRoute = Router();

indexRoute.get("", async (req, res) => {
  res.json({ message: "The Auracoin server is online" });
});

indexRoute.use("/api/zora-coins", zoraCoinRoute);
indexRoute.use("/api/webhook", webhookRoute);
export default indexRoute;
