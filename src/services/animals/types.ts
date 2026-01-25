import {
  AnimalBreed,
  AnimalColor,
  AnimalFivAndFelv,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
  PaginationParams,
} from '../../utils';

export type CreateAnimalRequest = {
  name: string;
  sex: AnimalSex;
  species: AnimalSpecies;
  breed: AnimalBreed;
  size: AnimalSize;
  color: AnimalColor;
  birthDate?: string;
  microchip?: string;
  rga?: string;
  castrated: boolean;
  fiv: AnimalFivAndFelv;
  felv: AnimalFivAndFelv;
  notes?: string;
};

export type TotalAnimalsPerStageResponse = {
  quarantine: {
    dogs: number;
    cats: number;
    total: number;
  };
  sheltered: {
    dogs: number;
    cats: number;
    total: number;
  };
  adopted: {
    dogs: number;
    cats: number;
    total: number;
  };
};

export interface GetAllAnimalsParams extends PaginationParams {
  search?: string;
}

export type GetAnimalResponse = {
  uuid: string;
  name: string;
  sex: AnimalSex;
  species: AnimalSpecies;
  breed: AnimalBreed;
  size: AnimalSize;
  color: AnimalColor;
  birthDate: string;
  microchip: string;
  rga: string;
  castrated: boolean;
  fiv: AnimalFivAndFelv;
  felv: AnimalFivAndFelv;
  status: AnimalStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DeleteAnimalRequest = {
  uuid: string;
};
