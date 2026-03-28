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
  file,
}: T.CreateAnimalRequest) => {
  const formData = new FormData();

  formData.append('name', name);
  formData.append('sex', sex);
  formData.append('species', species);
  formData.append('breed', breed);
  formData.append('size', size);
  formData.append('color', color);
  formData.append('castrated', String(castrated));
  formData.append('fiv', fiv);
  formData.append('felv', felv);

  if (birthDate) formData.append('birthDate', birthDate);
  if (microchip) formData.append('microchip', microchip);
  if (rga) formData.append('rga', rga);
  if (notes) formData.append('notes', notes);
  if (file) formData.append('file', file);

  const { data } = await api.post('/animals', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
    file,
  }: T.UpdateAnimalRequest,
) => {
  const formData = new FormData();

  if (name !== undefined) formData.append('name', name);
  if (sex !== undefined) formData.append('sex', sex);
  if (species !== undefined) formData.append('species', species);
  if (breed !== undefined) formData.append('breed', breed);
  if (size !== undefined) formData.append('size', size);
  if (color !== undefined) formData.append('color', color);
  if (birthDate !== undefined && birthDate !== null) formData.append('birthDate', birthDate);
  if (microchip !== undefined && microchip !== null) formData.append('microchip', microchip);
  if (rga !== undefined && rga !== null) formData.append('rga', rga);
  if (castrated !== undefined) formData.append('castrated', String(castrated));
  if (fiv !== undefined) formData.append('fiv', fiv);
  if (felv !== undefined) formData.append('felv', felv);
  if (status !== undefined) formData.append('status', status);
  if (notes !== undefined && notes !== null) formData.append('notes', notes);
  if (file) formData.append('file', file);

  const { data } = await api.patch(`/animals/${uuid}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const deleteAnimal = async ({ uuid }: T.DeleteAnimalRequest) => {
  const { data } = await api.delete(`/animals/${uuid}`);
  return data;
};
