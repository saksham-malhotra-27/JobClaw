import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import type { LlmProvider } from "@/agent/providers/provider";
import type {
  StructuredGenerationOutput,
  StructuredGenerationRequest,
} from "@/schemas/agent/structured-generation-schema";
import { CONSTANTS } from "@/shared/constants";

export class GeminiProvider implements LlmProvider {
  public readonly providerName =
    CONSTANTS.LLM.PROVIDERS.GEMINI;

  private readonly client: GoogleGenAI;
  private readonly model: string;

  public constructor() {
    const apiKey =
      process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is not set.",
      );
    }

    this.client = new GoogleGenAI({
      apiKey,
    });

    this.model =
      process.env.GEMINI_MODEL?.trim() ||
      CONSTANTS.GEMINI.DEFAULT_MODEL;
  }

  public async generateStructuredOutput<T>(
    request: StructuredGenerationRequest<T>,
  ): Promise<StructuredGenerationOutput<T>> {
    const startedAt = performance.now();

    const response =
      await this.client.models.generateContent({
        model: this.model,
        contents: request.userPrompt,
        config: {
          systemInstruction:
            request.systemPrompt,
          responseMimeType:
            "application/json",
          responseJsonSchema:
            z.toJSONSchema(request.schema),
        },
      });

    const responseText =
      response.text?.trim();

    if (!responseText) {
      throw new Error(
        "Gemini did not return structured output.",
      );
    }

    let parsedContent: unknown;

    try {
      parsedContent =
        JSON.parse(responseText);
    } catch {
      throw new Error(
        "Gemini returned invalid JSON.",
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
      inputTokens:
        response.usageMetadata?.promptTokenCount,
      outputTokens:
        response.usageMetadata?.candidatesTokenCount,
    };
  }
}