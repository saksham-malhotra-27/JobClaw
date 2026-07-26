import { readFile } from "node:fs/promises";
import path from "node:path";

import * as XLSX from "xlsx";

import {
  sourceDefinitionSchema,
  type SourceDefinition,
} from "@/schemas/source-catalogue/source-definition-schema";
import type { SourceCatalogueReader } from "@/source-catalogue/source-catalogue-reader";

interface RawSourceDefinition {
  id?: unknown;
  name?: unknown;
  sitePattern?: unknown;
  enabled?: unknown;
  priority?: unknown;
}

export class ExcelSourceCatalogueReader
  implements SourceCatalogueReader
{
  public async read(
    filePath: string,
  ): Promise<SourceDefinition[]> {
    const resolvedFilePath =
      path.resolve(process.cwd(), filePath);

    let fileBuffer: Buffer;

    try {
      fileBuffer =
        await readFile(resolvedFilePath);
    } catch {
      throw new Error(
        `Cannot access file ${resolvedFilePath}`,
      );
    }

    const workbook = XLSX.read(fileBuffer, {
      type: "buffer",
    });

    const firstSheetName =
      workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error(
        `Source catalogue has no worksheets: ${resolvedFilePath}`,
      );
    }

    const worksheet =
      workbook.Sheets[firstSheetName];

    if (!worksheet) {
      throw new Error(
        `Could not read worksheet "${firstSheetName}".`,
      );
    }

    const rows =
      XLSX.utils.sheet_to_json<RawSourceDefinition>(
        worksheet,
        {
          defval: undefined,
        },
      );

    const sources = rows.map(
      (row, rowIndex) => {
        const parsedSource =
          sourceDefinitionSchema.safeParse({
            id: row.id,
            name: row.name,
            sitePattern: row.sitePattern,
            enabled:
              this.parseBoolean(row.enabled),
            priority:
              this.parseNumber(row.priority),
          });

        if (!parsedSource.success) {
          const excelRowNumber =
            rowIndex + 2;

          throw new Error(
            `Invalid source catalogue row ${excelRowNumber}: ${parsedSource.error.message}`,
          );
        }

        return parsedSource.data;
      },
    );

    return sources
      .filter((source) => source.enabled)
      .sort(
        (firstSource, secondSource) =>
          firstSource.priority -
          secondSource.priority,
      );
  }

  private parseBoolean(
    value: unknown,
  ): unknown {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalisedValue =
        value.trim().toLowerCase();

      if (normalisedValue === "true") {
        return true;
      }

      if (normalisedValue === "false") {
        return false;
      }
    }

    return value;
  }

  private parseNumber(
    value: unknown,
  ): unknown {
    if (typeof value === "number") {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      const parsedNumber = Number(value);

      return Number.isNaN(parsedNumber)
        ? value
        : parsedNumber;
    }

    return value;
  }
}