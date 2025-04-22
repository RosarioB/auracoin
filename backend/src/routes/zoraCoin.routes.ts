import { Router } from "express";
import {
  createZoraCoin,
  deleteZoraCoin,
  getZoraCoinById,
  getZoraCoins,
  updateZoraCoin,
  countZoraCoins,
} from "../controllers/zoraCoin.controller.js";

const nftRoute = Router();

nftRoute.post("", createZoraCoin);
nftRoute.get("", getZoraCoins);
nftRoute.get("/count", countZoraCoins);
nftRoute.get("/:id", getZoraCoinById);
nftRoute.delete("/:id", deleteZoraCoin);
nftRoute.put("/:id", updateZoraCoin);

export default nftRoute;
