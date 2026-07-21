import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import type { LlmProvider } from "@/agent/providers/provider";
import type { StructuredGenerationOutput, StructuredGenerationRequest } from "@/schemas/agent/structured-generation-schema";

import { CONSTANTS } from "@/shared/constants";

export class OpenAIProvider implements LlmProvider {
    public readonly providerName = CONSTANTS.LLM.PROVIDERS.OPENAI;
    private readonly client: OpenAI; 
    private readonly model: string; 

    public constructor(){
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY environment variable is not set.");
        }

        this.client = new OpenAI({ apiKey });
        this.model = process.env.OPENAI_MODEL || CONSTANTS.OPENAI.DEFAULT_MODEL;
    }

     
    public async generateStructuredOutput<T>(
        request: StructuredGenerationRequest<T>,
        ): Promise<StructuredGenerationOutput<T>> {
        const startedAt = performance.now();

        const response = await this.client.responses.parse({
            model: this.model,
            input: [
              {
                role: "system",
                content: request.systemPrompt,
              },
              {
                role: "user",
                content: request.userPrompt,
              },
            ],
            text: {
              format: zodTextFormat(
                request.schema,
                request.schemaName,
              ),
            },
        });

        const parsedOutput = response.output_parsed;

        if (!parsedOutput) {
            throw new Error(
              "OpenAI did not return valid structured output.",
            );
        }

        return {
            output: parsedOutput,
            provider: this.providerName,
            model: this.model,
            latencyMs: Math.round(performance.now() - startedAt),
            inputTokens: response.usage?.input_tokens,
            outputTokens: response.usage?.output_tokens,
        };
        }
}