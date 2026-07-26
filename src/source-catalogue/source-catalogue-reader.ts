import type { SourceDefinition } from "@/schemas/source-catalogue/source-definition-schema";

export interface SourceCatalogueReader {
  read(filePath: string): Promise<SourceDefinition[]>;
}