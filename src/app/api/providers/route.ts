import { NextResponse } from "next/server";

import { getProviderAvailability } from "@/agent/providers/provider-availability";
import {
  providersErrorResponseSchema,
  providersSuccessResponseSchema,
} from "@/schemas/agent/providers-response-schema";
import { CONSTANTS } from "@/shared/constants";

export async function GET() {
  try {
    const providers =
      await getProviderAvailability();

    const successResponse =
      providersSuccessResponseSchema.parse({
        success: true,
        data: providers,
      });

    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    console.error(
      "Provider discovery failed:",
      error,
    );

    const errorResponse =
      providersErrorResponseSchema.parse({
        success: false,
        error: {
          code:
            CONSTANTS.ERROR_CODES
              .PROVIDER_DISCOVERY_FAILED,
          message:
            "JobClaw could not retrieve provider availability.",
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