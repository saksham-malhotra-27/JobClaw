import { NextResponse } from "next/server";

import { loadSourceCatalogues } from "@/source-catalogue/source-catalogue-service";
import { selectSources } from "@/source-catalogue/source-selector";
import { discoveryScopeSchema } from "@/schemas/agent/search-intent-schema";

export const runtime = "nodejs";

export async function GET(
  request: Request,
) {
  try {
    const requestUrl =
      new URL(request.url);

    const parsedScope =
      discoveryScopeSchema.safeParse(
        requestUrl.searchParams.get("scope") ??
          "both",
      );

    if (!parsedScope.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "scope must be ats, company_career, or both.",
          },
        },
        {
          status: 400,
        },
      );
    }

    const catalogues =
      await loadSourceCatalogues();

    const selectedSources =
      selectSources({
        discoveryScope:
          parsedScope.data,
        atsSources:
          catalogues.atsSources,
        companyCareerSources:
          catalogues.companyCareerSources,
      });

    return NextResponse.json({
      success: true,
      data: selectedSources,
    });
  } catch (error: unknown) {
    console.error(
      "Source selection failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Could not select sources.",
        },
      },
      {
        status: 500,
      },
    );
  }
}