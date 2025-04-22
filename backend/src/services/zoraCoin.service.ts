import { ZoraCoin } from "../models/zoraCoin.model.js";
import ZoraCoinsRepository from "../repositories/zoraCoin.repository.js";

class ZoraCoinService {
  async createZoraCoin(data: ZoraCoin): Promise<ZoraCoin> {
    return ZoraCoinsRepository.createZoraCoin(data);
  }

  async getZoraCoins(): Promise<ZoraCoin[]> {
    return ZoraCoinsRepository.getZoraCoins();
  }

  async getZoraCoinById(id: string): Promise<ZoraCoin | null> {
    return ZoraCoinsRepository.getZoraCoinById(id);
  }

  async deleteZoraCoin(id: string): Promise<void> {
    ZoraCoinsRepository.deleteZoraCoin(id);
  }

  async updateZoraCoin(id: string, data: Partial<ZoraCoin>): Promise<ZoraCoin> {
    return ZoraCoinsRepository.updateZoraCoin(id, data);
  }

  async countZoraCoins(): Promise<number> {
    return ZoraCoinsRepository.countZoraCoins();
  }
}

export default new ZoraCoinService();
