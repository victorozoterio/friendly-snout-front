import z from 'zod';
import { AnimalStatus } from '../../../../utils';
import { createAnimalSchema } from '../create-animal-drawer/schema';

export const updateAnimalSchema = createAnimalSchema.extend({
  status: z.enum(AnimalStatus, { message: 'Campo obrigatório' }),
});

export type UpdateAnimalFormData = z.infer<typeof updateAnimalSchema>;
