import { Pagination } from '../../utils';
import { api } from '../axios';
import * as T from './types';

export const createAnimal = async ({
  name,
  sex,
  species,
  breed,
  size,
  color,
  birthDate,
  microchip,
  rga,
  castrated,
  fiv,
  felv,
  notes,
}: T.CreateAnimalRequest) => {
  const { data } = await api.post('/animals', {
    name,
    sex,
    species,
    breed,
    size,
    color,
    birthDate,
    microchip,
    rga,
    castrated,
    fiv,
    felv,
    notes,
  });

  return data;
};

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

export const getAnimalByUuid = async (uuid: string) => {
  const { data } = await api.get<T.GetAnimalResponse>(`/animals/${uuid}`);
  return data;
};

export const updateAnimal = async (
  uuid: string,
  {
    name,
    sex,
    species,
    breed,
    size,
    color,
    birthDate,
    microchip,
    rga,
    castrated,
    fiv,
    felv,
    status,
    notes,
  }: T.UpdateAnimalRequest,
) => {
  const { data } = await api.patch(`/animals/${uuid}`, {
    name,
    sex,
    species,
    breed,
    size,
    color,
    birthDate,
    microchip,
    rga,
    castrated,
    fiv,
    felv,
    status,
    notes,
  });

  return data;
};

export const deleteAnimal = async ({ uuid }: T.DeleteAnimalRequest) => {
  const { data } = await api.delete(`/animals/${uuid}`);
  return data;
};
