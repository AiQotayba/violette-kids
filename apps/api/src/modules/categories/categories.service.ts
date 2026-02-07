import { categoriesRepository } from "./categories.repository.js";

export const categoriesService = {
  getList: categoriesRepository.findMany.bind(categoriesRepository),
  getById: categoriesRepository.findById.bind(categoriesRepository),
  create: categoriesRepository.create.bind(categoriesRepository),
  update: categoriesRepository.update.bind(categoriesRepository),
  delete: categoriesRepository.delete.bind(categoriesRepository),
  reorder: categoriesRepository.reorder.bind(categoriesRepository),
};
