import { Card } from "@/components/ui/Card";
import { MetadataCard } from "@/components/search/MetadataCard";
import type { SearchResultData } from "@/schemas/agent/search-response-schema";

interface SearchResultsProps {
  result: SearchResultData | null;
  errorMessage: string | null;
  isSubmitting: boolean;
}

export function SearchResults({
  result,
  errorMessage,
  isSubmitting,
}: SearchResultsProps) {
  return (
    <Card className="min-h-[500px]">
      <h2 className="mb-4 text-lg font-semibold">
        Structured output
      </h2>

      {!result &&
        !errorMessage &&
        !isSubmitting && (
          <p className="text-sm text-zinc-500">
            The generated search intent will appear
            here.
          </p>
        )}

      {isSubmitting && (
        <p className="text-sm text-zinc-400">
          Generating structured output...
        </p>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4">
          <p className="text-sm font-medium text-red-300">
            Request failed
          </p>

          <p className="mt-1 text-sm text-red-400">
            {errorMessage}
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <MetadataCard
              label="Provider"
              value={result.generation.provider}
            />

            <MetadataCard
              label="Model"
              value={result.generation.model}
            />

            <MetadataCard
              label="Latency"
              value={`${result.generation.latencyMs} ms`}
            />

            <MetadataCard
              label="Tokens"
              value={formatTokenUsage(
                result.generation.inputTokens,
                result.generation.outputTokens,
              )}
            />
          </div>

          <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
            {JSON.stringify(
              result.intent,
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </Card>
  );
}

function formatTokenUsage(
  inputTokens?: number,
  outputTokens?: number,
): string {
  return `${inputTokens ?? "N/A"} in / ${outputTokens ?? "N/A"} out`;
}