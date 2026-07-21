import { NextResponse } from "next/server";

import { parseSearchIntent } from "@/agent/search-intent-parser";
import { searchRequestSchema } from "@/schemas/agent/search-request-schema";
import {
  searchErrorResponseSchema,
  searchSuccessResponseSchema,
} from "@/schemas/agent/search-response-schema";
import { CONSTANTS } from "@/shared/constants";

export async function POST(request: Request) {
  try {
    const requestBody: unknown =
      await request.json();

    const parsedRequest =
      searchRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      const errorResponse =
        searchErrorResponseSchema.parse({
          success: false,
          error: {
            code:
              CONSTANTS.ERROR_CODES.INVALID_INPUT,
            message:
              "Please provide a valid provider, system prompt, and user prompt.",
            details:
              parsedRequest.error.flatten(),
          },
        });

      return NextResponse.json(
        errorResponse,
        {
          status: 400,
        },
      );
    }

    const generation =
      await parseSearchIntent(
        parsedRequest.data,
      );

    const successResponse =
      searchSuccessResponseSchema.parse({
        success: true,
        data: {
          intent: generation.output,
          generation: {
            provider: generation.provider,
            model: generation.model,
            latencyMs: generation.latencyMs,
            ...(generation.inputTokens !== undefined && {
              inputTokens: generation.inputTokens,
            }),
            ...(generation.outputTokens !== undefined && {
              outputTokens: generation.outputTokens,
            }),
          },
        },
      });

    return NextResponse.json(
      successResponse,
    );
  } catch (error: unknown) {
    console.error(
      "Job search request failed:",
      error,
    );

    const errorResponse =
      searchErrorResponseSchema.parse({
        success: false,
        error: {
          code:
            CONSTANTS.ERROR_CODES
              .SEARCH_INITIALIZATION_FAILED,
          message:
            "JobClaw could not process the search request.",
        },
      });

    return NextResponse.json(
      errorResponse,
      {
        status: 500,
      },
    );
  }
}