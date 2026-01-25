import { z } from 'zod';
import {
  AnimalBreed,
  AnimalColor,
  AnimalFivAndFelv,
  AnimalSex,
  AnimalSize,
  AnimalSpecies,
  isValidBrazilianBirthDate,
} from '../../../../utils';

export const createAnimalSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  sex: z.enum(AnimalSex, { message: 'Campo obrigatório' }),
  species: z.enum(AnimalSpecies, { message: 'Campo obrigatório' }),
  breed: z.enum(AnimalBreed, { message: 'Campo obrigatório' }),
  size: z.enum(AnimalSize, { message: 'Campo obrigatório' }),
  color: z.enum(AnimalColor, { message: 'Campo obrigatório' }),
  birthDate: z
    .string()
    .optional()
    .refine((v) => !v || isValidBrazilianBirthDate(v), { message: 'Data de nascimento inválida' }),
  microchip: z.string().optional(),
  rga: z.string().optional(),
  castrated: z.boolean(),
  fiv: z.enum(AnimalFivAndFelv, { message: 'Campo obrigatório' }),
  felv: z.enum(AnimalFivAndFelv, { message: 'Campo obrigatório' }),
  notes: z.string().optional(),
});

export type CreateAnimalFormData = z.infer<typeof createAnimalSchema>;
