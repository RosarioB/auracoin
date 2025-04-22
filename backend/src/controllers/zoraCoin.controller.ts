import { Request, Response } from "express";
import ZoraCoinService from "../services/zoraCoin.service.js";
import { errorWithTimestamp, logWithTimestamp } from "../utils/logging.js";

export async function createZoraCoin(req: Request, res: Response): Promise<void> {
  try {
    const zoraCoin = await ZoraCoinService.createZoraCoin(req.body);
    logWithTimestamp(`Zora Coin Successfully Created with id: ${zoraCoin.coinId}`);
    res.status(200).json({
      status: true,
      message: "ZoraCoin Successfully Created",
      data: zoraCoin,
    });
  } catch (error) {
    errorWithTimestamp(
      `[${new Date().toISOString()}] Error creating ZoraCoin:`,
      error
    );
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function getZoraCoins(req: Request, res: Response): Promise<void> {
  try {
    const zoraCoins = await ZoraCoinService.getZoraCoins();
    if (!zoraCoins) {
      logWithTimestamp(`ZoraCoins Not Found`);
      res.status(404).json({
        status: false,
        message: "ZoraCoins Not Found",
      });
      return;
    }
    logWithTimestamp(`ZoraCoins Successfully fetched with ids: ${zoraCoins.map((zoraCoin) => zoraCoin.coinId)}`);
    res.status(200).json({
      status: true,
      message: "ZoraCoins Successfully fetched",
      data: zoraCoins,
    });
  } catch (error) {
    errorWithTimestamp(`Error fetching ZoraCoins:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function getZoraCoinById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const zoraCoin = await ZoraCoinService.getZoraCoinById(id);
    if (!zoraCoin) {
      logWithTimestamp(`ZoraCoin Not Found with id: ${id}`);
      res.status(404).json({
        status: false,
        message: "ZoraCoin Not Found",
      });
      return;
    }
    logWithTimestamp(`ZoraCoin Successfully fetched with id: ${id}`);
    res.status(200).json({
      status: true,
      message: "ZoraCoin Successfully fetched",
      data: zoraCoin,
    });
  } catch (error) {
    errorWithTimestamp(`Error fetching ZoraCoin by ID:`, error);
    res.status(500).json({
      status: false,
      message: "An error occurred",
    });
  }
}

export async function deleteZoraCoin(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const zoraCoin = await ZoraCoinService.getZoraCoinById(id);
    if (!zoraCoin) {
      logWithTimestamp(`ZoraCoin not found with id: ${id}`);
      res.status(404).json({
        status: false,
        message: "ZoraCoin not found",
      });
      return;
    }
    await ZoraCoinService.deleteZoraCoin(id);
    logWithTimestamp(`ZoraCoin Successfully deleted with id: ${id}`);
    res.status(200).json({
      status: true,
      message: "ZoraCoin Successfully deleted",
    });
  } catch (error) {
    errorWithTimestamp(`Error deleting ZoraCoin:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function updateZoraCoin(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const zoraCoin = await ZoraCoinService.getZoraCoinById(id);
    if (!zoraCoin) {
      logWithTimestamp(`ZoraCoin not found with id: ${id}`);
      res.status(404).json({
        status: false,
        message: "ZoraCoin not found",
      });
      return;
    }
    const updatedZoraCoin = await ZoraCoinService.updateZoraCoin(id, req.body);
    logWithTimestamp(`ZoraCoin Successfully updated with id: ${id}`);
    res.json({
      status: true,
      message: "ZoraCoin Successfully updated",
      data: updatedZoraCoin,
    });
  } catch (error) {
    errorWithTimestamp(`Error updating ZoraCoin:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function countZoraCoins(req: Request, res: Response): Promise<void> {
  try {
    const count = await ZoraCoinService.countZoraCoins();
    logWithTimestamp(`ZoraCoins count: ${count}`);
    res.status(200).json({
      status: true,
      message: "ZoraCoins count successfully invoked",
      data: { count },
    });
  } catch (error) {
    errorWithTimestamp(`Error counting ZoraCoins:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}
