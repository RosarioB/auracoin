import { ZoraCoin, ZoraCoinModel } from "../models/zoraCoin.model.js";

class ZoraCoinsRepository {
  async createZoraCoin(data: ZoraCoin) {
    const zoraCoins = new ZoraCoinModel(data);
    return zoraCoins.save();
  }

  async getZoraCoins() {
    return ZoraCoinModel.find();
  }

  async getZoraCoinById(id: string) {
    return ZoraCoinModel.findOne({ coinId: id });
  }

  async deleteZoraCoin(id: string) {
    return ZoraCoinModel.findOneAndDelete({ coinId: id });
  }

  async updateZoraCoin(id: string, data: Partial<ZoraCoin>) {
    return ZoraCoinModel.findOneAndUpdate({ coinId: id }, data, { new: true });
  }

  async countZoraCoins() {
    return ZoraCoinModel.countDocuments();
  }
}

export default new ZoraCoinsRepository();
