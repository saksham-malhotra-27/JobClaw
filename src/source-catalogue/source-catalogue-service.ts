import { ExcelSourceCatalogueReader } from "@/source-catalogue/excel-source-catalogue-reader";
import type { SourceDefinition } from "@/schemas/source-catalogue/source-definition-schema";

export interface SourceCatalogues {
  atsSources: SourceDefinition[];
  companyCareerSources: SourceDefinition[];
}

export async function loadSourceCatalogues(): Promise<SourceCatalogues> {
  const atsFilePath =
    process.env.ATS_SOURCE_FILE_PATH;

  const companyCareerFilePath =
    process.env.COMPANY_SOURCE_FILE_PATH;

  if (!atsFilePath) {
    throw new Error(
      "ATS_SOURCE_FILE_PATH environment variable is not set.",
    );
  }

  if (!companyCareerFilePath) {
    throw new Error(
      "COMPANY_SOURCE_FILE_PATH environment variable is not set.",
    );
  }

  const reader =
    new ExcelSourceCatalogueReader();

  const [
    atsSources,
    companyCareerSources,
  ] = await Promise.all([
    reader.read(atsFilePath),
    reader.read(companyCareerFilePath),
  ]);

  return {
    atsSources,
    companyCareerSources,
  };
}