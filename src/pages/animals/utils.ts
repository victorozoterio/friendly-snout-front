import {
  AnimalBreed,
  AnimalColor,
  AnimalFivAndFelv,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
} from '../../utils';

export const translateAnimalStatus = (status?: AnimalStatus) => {
  switch (status) {
    case AnimalStatus.QUARANTINE:
      return 'Quarentena';
    case AnimalStatus.SHELTERED:
      return 'Acolhido';
    case AnimalStatus.ADOPTED:
      return 'Adotado';
    case AnimalStatus.LOST:
      return 'Perdido';
    default:
      return status;
  }
};

export const translateAnimalSex = (sex?: AnimalSex) => {
  switch (sex) {
    case AnimalSex.MALE:
      return 'Macho';
    case AnimalSex.FEMALE:
      return 'Fêmea';
    default:
      return sex;
  }
};

export const translateAnimalSpecies = (species?: AnimalSpecies) => {
  switch (species) {
    case AnimalSpecies.DOG:
      return 'Cachorro';
    case AnimalSpecies.CAT:
      return 'Gato';
    default:
      return species;
  }
};

export const translateAnimalSize = (size?: AnimalSize) => {
  switch (size) {
    case AnimalSize.SMALL:
      return 'Pequeno';
    case AnimalSize.MEDIUM:
      return 'Médio';
    case AnimalSize.LARGE:
      return 'Grande';
    default:
      return size;
  }
};

export const translateAnimalColor = (color?: AnimalColor) => {
  switch (color) {
    case AnimalColor.BLACK:
      return 'Preto';
    case AnimalColor.WHITE:
      return 'Branco';
    case AnimalColor.GRAY:
      return 'Cinza';
    case AnimalColor.BROWN:
      return 'Marrom';
    case AnimalColor.GOLDEN:
      return 'Dourado';
    case AnimalColor.CREAM:
      return 'Creme';
    case AnimalColor.TAN:
      return 'Caramelo';
    case AnimalColor.SPECKLED:
      return 'Malhado';
    default:
      return color;
  }
};

export const translateAnimalFivAndFelv = (status?: AnimalFivAndFelv) => {
  switch (status) {
    case AnimalFivAndFelv.YES:
      return 'Sim';
    case AnimalFivAndFelv.NO:
      return 'Não';
    case AnimalFivAndFelv.NOT_TESTED:
      return 'Não testado';
    default:
      return status;
  }
};

export const translateAnimalBreed = (breed?: AnimalBreed) => {
  switch (breed) {
    case AnimalBreed.MIXED_BREED:
      return 'S.R.D.';
    case AnimalBreed.SHIH_TZU:
      return 'Shih Tzu';
    case AnimalBreed.YORKSHIRE_TERRIER:
      return 'Yorkshire';
    case AnimalBreed.GERMAN_SPITZ:
      return 'Spitz Alemão';
    case AnimalBreed.FRENCH_BULLDOG:
      return 'Bulldog Francês';
    case AnimalBreed.POODLE:
      return 'Poodle';
    case AnimalBreed.LHASA_APSO:
      return 'Lhasa Apso';
    case AnimalBreed.GOLDEN_RETRIEVER:
      return 'Golden';
    case AnimalBreed.ROTTWEILER:
      return 'Rottweiler';
    case AnimalBreed.LABRADOR_RETRIEVER:
      return 'Labrador';
    case AnimalBreed.PUG:
      return 'Pug';
    case AnimalBreed.GERMAN_SHEPHERD:
      return 'Pastor Alemão';
    case AnimalBreed.BORDER_COLLIE:
      return 'Border Collie';
    case AnimalBreed.LONG_HAIRED_CHIHUAHUA:
      return 'Chihuahua';
    case AnimalBreed.BELGIAN_MALINOIS:
      return 'Pastor Belga Malinois';
    case AnimalBreed.MALTESE:
      return 'Maltês';
    default:
      return breed;
  }
};
