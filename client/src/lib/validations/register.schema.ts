import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(3, { message: 'Display name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});
export type RegisterSchema = z.infer<typeof registerSchema>;
