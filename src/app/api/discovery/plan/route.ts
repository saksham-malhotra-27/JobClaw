import { NextResponse } from "next/server";
import { z } from "zod";

import { createDiscoveryPlan } from "@/orchestration/discovery-batch-planner";
import { searchIntentSchema } from "@/schemas/agent/search-intent-schema";
import { executionPreferencesSchema } from "@/schemas/agent/search-request-schema";
import { loadSourceCatalogues } from "@/source-catalogue/source-catalogue-service";
import { selectSources } from "@/source-catalogue/source-selector";
import { CONSTANTS } from "@/shared/constants";

export const runtime = "nodejs";

const discoveryPlanRequestSchema = z.object({
  intent: searchIntentSchema,
  execution: executionPreferencesSchema,
});

export async function POST(
  request: Request,
) {
  try {
    const requestBody: unknown =
      await request.json();

    const parsedRequest =
      discoveryPlanRequestSchema.safeParse(
        requestBody,
      );

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code:
              CONSTANTS.ERROR_CODES.INVALID_INPUT,
            message:
              "Please provide a valid search intent and execution preferences.",
            details:
              parsedRequest.error.flatten(),
          },
        },
        {
          status: 400,
        },
      );
    }

    const {
      intent,
      execution,
    } = parsedRequest.data;

    const catalogues =
      await loadSourceCatalogues();

    const selectedSources =
      selectSources({
        discoveryScope:
          intent.discoveryScope,
        atsSources:
          catalogues.atsSources,
        companyCareerSources:
          catalogues.companyCareerSources,
      });

    const discoveryPlan =
      createDiscoveryPlan({
        selectedSources,
        execution,
        pagesPerSource:
          intent.pagesPerSource,
      });

    return NextResponse.json({
      success: true,
      data: discoveryPlan,
    });
  } catch (error: unknown) {
    console.error(
      "Discovery plan creation failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          code:
            CONSTANTS.ERROR_CODES
              .SEARCH_INITIALIZATION_FAILED,
          message:
            error instanceof Error
              ? error.message
              : "JobClaw could not create the discovery plan.",
        },
      },
      {
        status: 500,
      },
    );
  }
}