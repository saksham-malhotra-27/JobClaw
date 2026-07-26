import { z } from "zod";

export const sourceDefinitionSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1),

  name: z
    .string()
    .trim()
    .min(1),

  sitePattern: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) =>
        !value.startsWith("http://") &&
        !value.startsWith("https://") &&
        !value.startsWith("site:"),
      {
        message:
          "sitePattern must not include a protocol or the site: operator.",
      },
    ),

  enabled: z.boolean(),

  priority: z
    .number()
    .int()
    .nonnegative(),
});

export const sourceDefinitionsSchema =
  z.array(sourceDefinitionSchema);

export type SourceDefinition =
  z.infer<typeof sourceDefinitionSchema>;