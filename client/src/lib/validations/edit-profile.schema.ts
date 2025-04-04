import { z } from 'zod';

export const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: 'Display name is required' })
    .max(50, { message: 'Display name must be less than 50 characters' }),
  bio: z.string().optional(),
});
export type EditProfileSchema = z.infer<typeof editProfileSchema>;
