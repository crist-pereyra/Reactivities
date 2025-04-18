import { z } from 'zod';

export const addCommentSchema = z.object({
  comment: z.string().min(3, { message: 'Comment is required' }),
});

export type AddCommentSchema = z.infer<typeof addCommentSchema>;
