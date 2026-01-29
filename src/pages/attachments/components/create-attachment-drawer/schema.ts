import { z } from 'zod';

export const createAttachmentSchema = z
  .object({
    file: z.instanceof(File, { message: 'Selecione um arquivo' }).optional(),
  })
  .refine((data) => data.file != null && data.file.size > 0, {
    message: 'Selecione um arquivo para enviar',
    path: ['file'],
  });

export type CreateAttachmentFormData = z.infer<typeof createAttachmentSchema>;
