import { z } from 'zod';

export const createMedicineSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  description: z.string().optional(),
  quantity: z.union([z.number().int().min(-1, 'Quantidade deve ser maior ou igual a -1')]),
  medicineBrandUuid: z.string().min(1, 'Campo obrigatório'),
});

export type CreateMedicineFormData = z.infer<typeof createMedicineSchema>;
