import { getCustomRepository, Repository } from "typeorm";
import { Settings } from "../entities/Settings";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface SettingsCreateInterface {
  chat: boolean;
  username: string;
}

class SettingsService {
  private settingsRepository: Repository<Settings>;

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }
  async create({ chat, username }: SettingsCreateInterface) {
    const userAlreadyExists = await this.settingsRepository.findOne({
      username,
    });

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }
    const settings = this.settingsRepository.create({
      chat,
      username,
    });

    await this.settingsRepository.save(settings);
    return settings;
  }

  async findByUserName(username: string) {
    return await this.settingsRepository.findOne({ username });
  }

  async update(username: string, chat: boolean) {
    const settings = await this.settingsRepository
      .createQueryBuilder()
      .update(Settings)
      .set({ chat })
      .where("username = :username", { username })
      .execute();
  }
}
export { SettingsService };
