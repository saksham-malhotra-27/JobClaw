import type { SearchIntent } from "@/schemas/agent/search-intent-schema";
import {
  selectedSourceGroupsSchema,
  type SelectedSourceGroups,
} from "@/schemas/source-catalogue/source-selection-schema";
import type { SourceDefinition } from "@/schemas/source-catalogue/source-definition-schema";

interface SelectSourcesInput {
  discoveryScope: SearchIntent["discoveryScope"];
  atsSources: SourceDefinition[];
  companyCareerSources: SourceDefinition[];
}

export function selectSources(
  input: SelectSourcesInput,
): SelectedSourceGroups {
  const {
    discoveryScope,
    atsSources,
    companyCareerSources,
  } = input;

  switch (discoveryScope) {
    case "ats":
      return selectedSourceGroupsSchema.parse({
        atsSources,
        companyCareerSources: [],
      });

    case "company_career":
      return selectedSourceGroupsSchema.parse({
        atsSources: [],
        companyCareerSources,
      });

    case "both":
      return selectedSourceGroupsSchema.parse({
        atsSources,
        companyCareerSources,
      });

    default: {
      const unsupportedScope: never =
        discoveryScope;

      throw new Error(
        `Unsupported discovery scope: ${unsupportedScope}`,
      );
    }
  }
}