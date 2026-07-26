import { z } from "zod";

import { sourceDefinitionSchema } from "@/schemas/source-catalogue/source-definition-schema";

export const selectedSourceGroupsSchema = z.object({
  atsSources: z.array(sourceDefinitionSchema),
  companyCareerSources: z.array(
    sourceDefinitionSchema,
  ),
});

export type SelectedSourceGroups =
  z.infer<typeof selectedSourceGroupsSchema>;