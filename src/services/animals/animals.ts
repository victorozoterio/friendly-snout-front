import { Pagination } from '../../utils';
import { api } from '../axios';
import * as T from './types';

export const totalAnimalsPerStage = async () => {
  const { data } = await api.get<T.TotalAnimalsPerStageResponse>('/animals/total-per-stage');
  return data;
};

export const getAllAnimals = async ({
  page = 1,
  limit = 10,
  sortBy = 'createdAt:DESC',
  search,
}: T.GetAllAnimalsParams) => {
  const { data } = await api.get<Pagination<T.GetAnimalResponse>>('/animals', {
    params: { page, limit, sortBy, search },
  });
  return data;
};

export const deleteAnimal = async ({ uuid }: T.DeleteAnimal) => {
  const { data } = await api.delete(`/animals/${uuid}`);
  return data;
};
