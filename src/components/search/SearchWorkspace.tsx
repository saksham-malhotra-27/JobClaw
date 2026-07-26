"use client";

import { SearchForm } from "@/components/search/SearchForm";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearch } from "@/hooks/useSearch";
import { CONSTANTS } from "@/shared/constants";

const DEFAULT_SYSTEM_PROMPT = [
  "Convert the user's job-search request into the required JSON schema.",
  "",
  "Rules:",
  "- Preserve explicitly requested roles and locations.",
  "- Use numeric values for experience only when explicitly stated.",
  "- Convert LPA into annual INR.",
  "- Do not calculate relative dates.",
  '- Represent phrases such as "yesterday" as a relative postedAfter value.',
  "- Set unspecified values to null or an empty array as required.",
  `- Default pagesPerSource to ${CONSTANTS.JOB_SEARCH.DEFAULT_PAGES_PER_SOURCE}.`,
  "- Do not add fields outside the schema.",
  "- Set discoveryScope to \"ats\" when the user requests ATS sources only.",
  "- Set discoveryScope to \"company_career\" when the user requests company career pages only.",
  "- Set discoveryScope to \"both\" when both are requested or no source preference is specified.",
].join("\n");

const DEFAULT_USER_PROMPT =
  "Find Software Engineer I jobs posted yesterday.";

export function SearchWorkspace() {
  const {
    result,
    errorMessage,
    isSubmitting,
    submitSearch,
  } = useSearch();

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
      <section>
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            JobClaw
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Structured job-search parser
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Select an LLM provider, edit both prompts,
            and generate a validated search intent.
          </p>
        </header>

        <SearchForm
          defaultProvider={
            CONSTANTS.LLM.DEFAULT_PROVIDER
          }
          defaultSystemPrompt={DEFAULT_SYSTEM_PROMPT}
          defaultUserPrompt={DEFAULT_USER_PROMPT}
          isSubmitting={isSubmitting}
          onSubmit={submitSearch}
        />
      </section>

      <section className="lg:pt-28">
        <SearchResults
          result={result}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
}