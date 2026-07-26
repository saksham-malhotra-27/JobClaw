import axios from "axios";

import type { ProviderDetails } from "@/schemas/agent/providers-response-schema";
import { CONSTANTS } from "@/shared/constants";

function isOpenAiAvailable(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY?.trim(),
  );
}

async function isOllamaAvailable(): Promise<boolean> {
  const baseUrl =
    process.env.OLLAMA_BASE_URL ??
    CONSTANTS.OLLAMA.DEFAULT_BASE_URL;

  try {
    await axios.get(
      `${baseUrl}${CONSTANTS.OLLAMA.TAGS_ENDPOINT}`,
      {
        timeout:
          CONSTANTS.LLM
            .AVAILABILITY_TIMEOUT_MS,
      },
    );

    return true;
  } catch {
    return false;
  }
}

function isGeminiAvailable(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY?.trim(),
  );
}

export async function getProviderAvailability(): Promise<
  ProviderDetails[]
> {
  const ollamaAvailable =
    await isOllamaAvailable();

  return [
    {
      id: CONSTANTS.LLM.PROVIDERS.OPENAI,
      label:
        CONSTANTS.LLM.PROVIDER_LABELS.OPENAI,
      available: isOpenAiAvailable(),
    },
    {
      id: CONSTANTS.LLM.PROVIDERS.OLLAMA,
      label:
        CONSTANTS.LLM.PROVIDER_LABELS.OLLAMA,
      available: ollamaAvailable,
    },
    {
      id: CONSTANTS.LLM.PROVIDERS.GEMINI,
      label:
        CONSTANTS.LLM.PROVIDER_LABELS.GEMINI,
      available: isGeminiAvailable(),
    },
  ];
}