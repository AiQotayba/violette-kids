import { ageGroupsRepository } from "./age-groups.repository.js";

export const ageGroupsService = {
  getList: ageGroupsRepository.findMany.bind(ageGroupsRepository),
  getById: ageGroupsRepository.findById.bind(ageGroupsRepository),
  create: ageGroupsRepository.create.bind(ageGroupsRepository),
  update: ageGroupsRepository.update.bind(ageGroupsRepository),
  delete: ageGroupsRepository.delete.bind(ageGroupsRepository),
};
