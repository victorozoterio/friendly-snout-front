import { AnimalBreed, AnimalColor, AnimalFivAndFelv, AnimalSex, AnimalSize, AnimalSpecies } from '../../../../utils';
import { CreateAnimalFormData } from './schema';

export type CreateAnimalDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type SelectOption<V extends string> = {
  value: V;
  label: string;
};

export type SpeciesValue = CreateAnimalFormData['species'];
export type SexValue = CreateAnimalFormData['sex'];
export type BreedValue = CreateAnimalFormData['breed'];
export type SizeValue = CreateAnimalFormData['size'];
export type ColorValue = CreateAnimalFormData['color'];
export type FivFelvValue = CreateAnimalFormData['fiv'];

export const speciesOptions: readonly SelectOption<SpeciesValue>[] = [
  { value: AnimalSpecies.DOG, label: 'Cachorro' },
  { value: AnimalSpecies.CAT, label: 'Gato' },
];

export const sexOptions: readonly SelectOption<SexValue>[] = [
  { value: AnimalSex.MALE, label: 'Macho' },
  { value: AnimalSex.FEMALE, label: 'Fêmea' },
];

export const breedOptions: readonly SelectOption<BreedValue>[] = [
  { value: AnimalBreed.MIXED_BREED, label: 'S.R.D.' },
  { value: AnimalBreed.SHIH_TZU, label: 'Shih Tzu' },
  { value: AnimalBreed.YORKSHIRE, label: 'Yorkshire' },
  { value: AnimalBreed.GERMAN_SPITZ, label: 'Spitz Alemão' },
  { value: AnimalBreed.FRENCH_BULLDOG, label: 'Bulldog Francês' },
  { value: AnimalBreed.POODLE, label: 'Poodle' },
  { value: AnimalBreed.LHASA_APSO, label: 'Lhasa Apso' },
  { value: AnimalBreed.GOLDEN, label: 'Golden' },
  { value: AnimalBreed.ROTTWEILER, label: 'Rottweiler' },
  { value: AnimalBreed.LABRADOR, label: 'Labrador' },
  { value: AnimalBreed.PUG, label: 'Pug' },
  { value: AnimalBreed.GERMAN_SHEPHERD, label: 'Pastor Alemão' },
  { value: AnimalBreed.BORDER_COLLIE, label: 'Border Collie' },
  { value: AnimalBreed.LONG, label: 'Chihuahua' },
  { value: AnimalBreed.BELGIAN, label: 'Pastor Belga Malinois' },
  { value: AnimalBreed.SIBERIAN_HUSKY, label: 'Husky Siberiano' },
  { value: AnimalBreed.MALTESE, label: 'Maltês' },
];

export const sizeOptions: readonly SelectOption<SizeValue>[] = [
  { value: AnimalSize.SMALL, label: 'Pequeno' },
  { value: AnimalSize.MEDIUM, label: 'Médio' },
  { value: AnimalSize.LARGE, label: 'Grande' },
];

export const colorOptions: readonly SelectOption<ColorValue>[] = [
  { value: AnimalColor.BLACK, label: 'Preto' },
  { value: AnimalColor.WHITE, label: 'Branco' },
  { value: AnimalColor.GRAY, label: 'Cinza' },
  { value: AnimalColor.BROWN, label: 'Marrom' },
  { value: AnimalColor.GOLDEN, label: 'Dourado' },
  { value: AnimalColor.CREAM, label: 'Creme' },
  { value: AnimalColor.TAN, label: 'Caramelo' },
  { value: AnimalColor.SPECKLED, label: 'Malhado' },
];

export const fivFelvOptions: readonly SelectOption<FivFelvValue>[] = [
  { value: AnimalFivAndFelv.YES, label: 'Sim' },
  { value: AnimalFivAndFelv.NO, label: 'Não' },
  { value: AnimalFivAndFelv.NOT_TESTED, label: 'Não testado' },
];

export const findOption = <V extends string>(
  options: readonly SelectOption<V>[],
  value: V | null | undefined,
): SelectOption<V> | null => {
  if (!value) return null;
  return options.find((o) => o.value === value) ?? null;
};
