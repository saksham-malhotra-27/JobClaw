import { OllamaProvider } from "@/agent/providers/ollama";
import { OpenAIProvider } from "@/agent/providers/openai";
import type { LlmProvider } from "@/agent/providers/provider";
import type { LlmProviderName } from "@/schemas/agent/search-request-schema";
import { CONSTANTS } from "@/shared/constants";

export function createLlmProvider(
  providerName: LlmProviderName,
): LlmProvider {
  switch (providerName) {
    case CONSTANTS.LLM.PROVIDERS.OPENAI:
      return new OpenAIProvider();

    case CONSTANTS.LLM.PROVIDERS.OLLAMA:
      return new OllamaProvider();

    default: {
      const unsupportedProvider: never =
        providerName;

      throw new Error(
        `Unsupported LLM provider: ${unsupportedProvider}`,
      );
    }
  }
}