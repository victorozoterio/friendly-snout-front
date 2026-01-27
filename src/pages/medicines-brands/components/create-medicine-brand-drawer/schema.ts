import { z } from 'zod';

export const createMedicineBrandSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
});

export type CreateMedicineBrandFormData = z.infer<typeof createMedicineBrandSchema>;
