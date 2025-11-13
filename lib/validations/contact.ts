import { z } from 'zod';

export const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  company_name: z.string().optional(),
  company_website: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['lead', 'prospect', 'customer', 'inactive']).default('lead'),
  lead_source: z.enum(['website', 'referral', 'cold_call', 'marketing', 'partner']).optional(),
  lead_score: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).optional(),
  social_profiles: z.record(z.string()).optional(),
  custom_fields: z.record(z.any()).optional(),
});

export const updateContactSchema = contactSchema.partial();

export type ContactInput = z.infer<typeof contactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
