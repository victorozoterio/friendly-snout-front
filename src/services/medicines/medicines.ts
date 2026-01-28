import { Pagination } from '../../utils';
import { api } from '../axios';
import * as T from './types';

export const createMedicine = async ({ name, description, quantity, medicineBrandUuid }: T.CreateMedicineRequest) => {
  const { data } = await api.post('/medicines', {
    name,
    description,
    quantity,
    medicineBrandUuid,
  });

  return data;
};

export const getAllMedicines = async ({
  page = 1,
  limit = 10,
  sortBy = 'createdAt:DESC',
  search,
}: T.GetAllMedicinesParams) => {
  const { data } = await api.get<Pagination<T.GetMedicineResponse>>('/medicines', {
    params: { page, limit, sortBy, search },
  });

  return data;
};

export const getMedicineByUuid = async (uuid: string) => {
  const { data } = await api.get<T.GetMedicineResponse>(`/medicines/${uuid}`);
  return data;
};

export const updateMedicine = async (
  uuid: string,
  { name, description, quantity, medicineBrandUuid }: T.UpdateMedicineRequest,
) => {
  const { data } = await api.patch(`/medicines/${uuid}`, {
    name,
    description,
    quantity,
    medicineBrandUuid,
  });

  return data;
};

export const activateMedicine = async ({ uuid }: T.ActivateMedicineRequest) => {
  const { data } = await api.patch(`/medicines/${uuid}/activate`);
  return data;
};

export const deactivateMedicine = async ({ uuid }: T.DeactivateMedicineRequest) => {
  const { data } = await api.patch(`/medicines/${uuid}/deactivate`);
  return data;
};

export const deleteMedicine = async ({ uuid }: T.DeleteMedicineRequest) => {
  const { data } = await api.delete(`/medicines/${uuid}`);
  return data;
};
