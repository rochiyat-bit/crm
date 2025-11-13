import { z } from 'zod';

export const dealSchema = z.object({
  name: z.string().min(1, 'Deal name is required'),
  description: z.string().optional(),
  contact_id: z.string().uuid().optional(),
  value: z.number().min(0, 'Value must be positive'),
  currency: z.string().length(3).default('USD'),
  stage: z
    .enum(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
    .default('prospecting'),
  probability: z.number().min(0).max(100).default(10),
  expected_close_date: z.string().datetime().optional(),
  pipeline_id: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  custom_fields: z.record(z.any()).optional(),
});

export const updateDealSchema = dealSchema.partial();

export const moveDealStageSchema = z.object({
  stage: z.enum([
    'prospecting',
    'qualification',
    'proposal',
    'negotiation',
    'closed_won',
    'closed_lost',
  ]),
  lost_reason: z.string().optional(),
});

export type DealInput = z.infer<typeof dealSchema>;
export type UpdateDealInput = z.infer<typeof updateDealSchema>;
export type MoveDealStageInput = z.infer<typeof moveDealStageSchema>;
