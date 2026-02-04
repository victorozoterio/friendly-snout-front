import { z } from 'zod';
import { brazilianDateTimeToUtcIso, MedicineApplicationFrequency } from '../../../../utils';

export const createMedicineApplicationSchema = z
  .object({
    medicineUuid: z.string().min(1, 'Campo obrigatório'),
    quantity: z
      .number('Campo obrigatório')
      .int('Quantidade deve ser um número inteiro')
      .min(1, 'Quantidade deve ser maior que 0'),
    appliedAt: z.string().min(1, 'Campo obrigatório'),
    scheduleNextApplication: z.boolean(),
    frequency: z.string().optional(),
    nextApplicationAt: z.string().optional(),
    endsAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleNextApplication) {
      if (!data.nextApplicationAt || data.nextApplicationAt.trim().length === 0) {
        ctx.addIssue({ code: 'custom', message: 'Campo obrigatório', path: ['nextApplicationAt'] });
      }

      if (!data.frequency || data.frequency.trim().length === 0) {
        ctx.addIssue({ code: 'custom', message: 'Campo obrigatório', path: ['frequency'] });
        return;
      }

      const isRepeating = data.frequency !== MedicineApplicationFrequency.DOES_NOT_REPEAT;

      if (isRepeating) {
        if (!data.endsAt || data.endsAt.trim().length === 0) {
          ctx.addIssue({ code: 'custom', message: 'Campo obrigatório', path: ['endsAt'] });
        }
      }
    }

    if (data.endsAt) {
      const appliedIso = brazilianDateTimeToUtcIso(data.appliedAt);
      const endsIso = brazilianDateTimeToUtcIso(data.endsAt);

      if (appliedIso && endsIso) {
        const applied = new Date(appliedIso).getTime();
        const ends = new Date(endsIso).getTime();

        if (!Number.isNaN(applied) && !Number.isNaN(ends) && ends < applied) {
          ctx.addIssue({ code: 'custom', message: 'Última aplicação deve ser após a aplicação', path: ['endsAt'] });
        }
      }
    }
  });

export type CreateMedicineApplicationFormData = z.infer<typeof createMedicineApplicationSchema>;
