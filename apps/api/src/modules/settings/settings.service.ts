import { settingsRepository } from "./settings.repository.js";

export const settingsService = {
  getList: settingsRepository.findMany.bind(settingsRepository),
  getById: settingsRepository.findById.bind(settingsRepository),
  create: settingsRepository.create.bind(settingsRepository),
  update: settingsRepository.update.bind(settingsRepository),
  delete: settingsRepository.delete.bind(settingsRepository),
};
