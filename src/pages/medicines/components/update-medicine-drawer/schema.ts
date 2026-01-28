import { z } from 'zod';
import { createMedicineSchema } from '../create-medicine-drawer/schema';

export const updateMedicineSchema = createMedicineSchema.extend({});

export type UpdateMedicineFormData = z.infer<typeof updateMedicineSchema>;
