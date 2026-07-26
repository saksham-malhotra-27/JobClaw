import { z } from "zod";

import { CONSTANTS } from "@/shared/constants";

export const discoveryScopeSchema = z.enum([
  "ats",
  "company_career",
  "both",
]);

export const searchIntentSchema = z.object({
  roles: z
    .array(z.string().trim().min(1))
    .min(1)
    .describe(
      "Job titles explicitly requested or clearly implied.",
    ),

  locations: z
    .array(z.string().trim().min(1))
    .describe(
      "Requested job locations. Empty when unspecified.",
    ),

  experience: z.object({
    minYears: z
      .number()
      .nonnegative()
      .nullable()
      .describe(
        "Minimum years explicitly requested. Null when unspecified.",
      ),

    maxYears: z
      .number()
      .nonnegative()
      .nullable()
      .describe(
        "Maximum years explicitly requested. Null when unspecified.",
      ),
  }),

  salary: z.object({
    min: z
      .number()
      .nonnegative()
      .nullable()
      .describe(
        "Minimum salary. Null when unspecified.",
      ),

    max: z
      .number()
      .nonnegative()
      .nullable()
      .describe(
        "Maximum salary. Null when unspecified.",
      ),

    currency: z
      .enum(["INR", "USD", "EUR", "GBP"])
      .nullable()
      .describe(
        "Salary currency. Null when salary is unspecified.",
      ),

    period: z
      .enum(["year", "month", "hour"])
      .nullable()
      .describe(
        "Salary period. Null when salary is unspecified.",
      ),
  }),

  postedAfter: z
    .object({
      type: z.enum([
        "relative",
        "absolute",
      ]),
      value: z.string().trim().min(1),
    })
    .nullable(),

  discoveryScope: discoveryScopeSchema
    .default("both")
    .describe(
      [
        'Use "ats" when the user explicitly requests ATS sources only.',
        'Use "company_career" when the user explicitly requests company career pages only.',
        'Use "both" when both are requested or no source preference is specified.',
      ].join(" "),
    ),

  pagesPerSource: z
    .number()
    .int()
    .positive()
    .default(
      CONSTANTS.JOB_SEARCH
        .DEFAULT_PAGES_PER_SOURCE,
    ),
});

export type DiscoveryScope =
  z.infer<typeof discoveryScopeSchema>;

export type SearchIntent =
  z.infer<typeof searchIntentSchema>;