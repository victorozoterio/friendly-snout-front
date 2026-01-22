import type {
  AnimalBreed,
  AnimalColor,
  AnimalFivAndFelv,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../utils';

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
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};
