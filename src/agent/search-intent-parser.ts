import { createLlmProvider } from "@/agent/providers/provider-factory";
import {
  searchIntentSchema,
  type SearchIntent,
} from "@/schemas/agent/search-intent-schema";
import type { SearchRequest } from "@/schemas/agent/search-request-schema";
import type { StructuredGenerationOutput } from "@/schemas/agent/structured-generation-schema";

export async function parseSearchIntent(
  request: SearchRequest,
): Promise<StructuredGenerationOutput<SearchIntent>> {
  const provider = createLlmProvider(
    request.provider,
  );

  return provider.generateStructuredOutput({
    systemPrompt: request.systemPrompt,
    userPrompt: request.userPrompt,
    schema: searchIntentSchema,
    schemaName: "job_search_intent",
  });
}