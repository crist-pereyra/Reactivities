import { z } from 'zod';

export const activitySchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().min(3, { message: 'Description is required' }),
  category: z.string().min(3, { message: 'Category is required' }),
  date: z.date({ required_error: 'Date is required' }),
  // city: z.string().min(3, { message: 'City is required' }),
  // venue: z.string().min(3, { message: 'Venue is required' }),
  location: z.object({
    venue: z.string().min(3, { message: 'Venue is required' }),
    city: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});
