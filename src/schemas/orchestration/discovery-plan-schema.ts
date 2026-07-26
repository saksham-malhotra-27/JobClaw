import { z } from "zod";

export const discoveryStrategySchema = z.enum([
  "ats",
  "company_career",
]);

export const discoveryTaskSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1),

  strategy: discoveryStrategySchema,

  sourceIds: z
    .array(
      z.string().trim().min(1),
    )
    .min(1)
    .max(20),

  pagesPerSource: z
    .number()
    .int()
    .positive(),
});

export const discoveryPlanSchema = z.object({
  tasks: z
    .array(discoveryTaskSchema)
    .min(1),
});

export type DiscoveryStrategy =
  z.infer<typeof discoveryStrategySchema>;

export type DiscoveryTask =
  z.infer<typeof discoveryTaskSchema>;

export type DiscoveryPlan =
  z.infer<typeof discoveryPlanSchema>;