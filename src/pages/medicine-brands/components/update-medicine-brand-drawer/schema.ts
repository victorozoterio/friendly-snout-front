import { z } from 'zod';

export const updateMedicineBrandSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
});

export type UpdateMedicineBrandFormData = z.infer<typeof updateMedicineBrandSchema>;
