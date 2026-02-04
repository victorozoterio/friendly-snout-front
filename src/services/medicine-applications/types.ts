import { MedicineApplicationFrequency, PaginationParams } from '../../utils';

export type CreateMedicineApplicationsParams = {
  animalUuid: string;
};

export type CreateMedicineApplicationRequest = CreateMedicineApplicationsParams & {
  medicineUuid: string;
  quantity: number;
  appliedAt: string;
  nextApplicationAt?: string;
  frequency?: MedicineApplicationFrequency;
  endsAt?: string;
};

export type GetAllMedicineApplicationsParams = PaginationParams & {
  animalUuid: string;
  search?: string;
};

export type GetMedicineApplicationResponse = {
  uuid: string;
  medicine: {
    uuid: string;
    name: string;
    description: string;
    quantity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  quantity: number;
  appliedAt: Date;
  nextApplicationAt?: Date;
  frequency?: MedicineApplicationFrequency;
  endsAt?: Date;
  googleCalendarEventId: string;
  createdAt: Date;
};

export type DeleteMedicineApplicationRequest = {
  uuid: string;
};
