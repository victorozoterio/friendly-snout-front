import { Pagination } from '../../utils';
import { api } from '../axios';
import * as T from './types';

export const createMedicineApplication = async ({
  animalUuid,
  medicineUuid,
  quantity,
  appliedAt,
  nextApplicationAt,
  frequency,
  endsAt,
}: T.CreateMedicineApplicationRequest) => {
  const { data } = await api.post(`/medicine-applications/animal/${animalUuid}`, {
    medicineUuid,
    quantity,
    appliedAt,
    nextApplicationAt,
    frequency,
    endsAt,
  });

  return data;
};

export const getAllMedicineApplications = async ({
  animalUuid,
  page = 1,
  limit = 10,
  sortBy = 'createdAt:DESC',
  search,
}: T.GetAllMedicineApplicationsParams) => {
  const { data } = await api.get<Pagination<T.GetMedicineApplicationResponse>>(
    `/medicine-applications/by-animal/${animalUuid}`,
    { params: { page, limit, sortBy, search } },
  );

  return data;
};

export const deleteMedicineApplication = async ({ uuid }: T.DeleteMedicineApplicationRequest) => {
  const { data } = await api.delete(`/medicine-applications/${uuid}`);
  return data;
};
