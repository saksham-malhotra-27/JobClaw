import axios, {
  type AxiosInstance,
  isAxiosError,
} from "axios";
import { z } from "zod";

import type { LlmProvider } from "@/agent/providers/provider";
import type {
  StructuredGenerationOutput,
  StructuredGenerationRequest,
} from "@/schemas/agent/structured-generation-schema";
import { CONSTANTS } from "@/shared/constants";

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
  prompt_eval_count?: number;
  eval_count?: number;
}

interface OllamaChatRequest {
  model: string;
  stream: false;
  think: false;
  format: Record<string, unknown>;
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
}

export class OllamaProvider implements LlmProvider {
  public readonly providerName =
    CONSTANTS.LLM.PROVIDERS.OLLAMA;

  private readonly client: AxiosInstance;
  private readonly model: string;

  public constructor() {
    const baseUrl =
      process.env.OLLAMA_BASE_URL ??
      CONSTANTS.OLLAMA.DEFAULT_BASE_URL;

    this.model =
      process.env.OLLAMA_MODEL ??
      CONSTANTS.OLLAMA.DEFAULT_MODEL;

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: CONSTANTS.OLLAMA.REQUEST_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async generateStructuredOutput<T>(
    request: StructuredGenerationRequest<T>,
  ): Promise<StructuredGenerationOutput<T>> {
    const startedAt = performance.now();

    const requestBody: OllamaChatRequest = {
      model: this.model,
      stream: false,
      think: false,
      format: z.toJSONSchema(request.schema),
      messages: [
        {
          role: "system",
          content: request.systemPrompt,
        },
        {
          role: "user",
          content: request.userPrompt,
        },
      ],
    };

    try {
      const response =
        await this.client.post<OllamaChatResponse>(
          CONSTANTS.OLLAMA.CHAT_ENDPOINT,
          requestBody,
        );

      const modelContent = response.data.message?.content;

      if (!modelContent) {
        throw new Error(
          "Ollama did not return structured output.",
        );
      }

      let parsedContent: unknown;

      try {
        parsedContent = JSON.parse(modelContent);
      } catch {
        throw new Error(
          "Ollama returned invalid JSON.",
        );
      }

      const validatedOutput =
        request.schema.parse(parsedContent);

      return {
        output: validatedOutput,
        provider: this.providerName,
        model: this.model,
        latencyMs: Math.round(
          performance.now() - startedAt,
        ),
        inputTokens: response.data.prompt_eval_count,
        outputTokens: response.data.eval_count,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          throw new Error(
            "Ollama request timed out.",
          );
        }

        if (error.response) {
          throw new Error(
            `Ollama request failed with status ${error.response.status}.`,
          );
        }

        if (error.request) {
          throw new Error(
            "Unable to connect to Ollama. Ensure the Ollama server is running.",
          );
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(
        "An unknown Ollama provider error occurred.",
      );
    }
  }
}