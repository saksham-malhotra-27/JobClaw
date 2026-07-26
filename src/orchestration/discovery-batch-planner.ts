import type { SearchIntent } from "@/schemas/agent/search-intent-schema";
import type { ExecutionPreferences } from "@/schemas/agent/search-request-schema";
import {
  discoveryPlanSchema,
  type DiscoveryPlan,
  type DiscoveryStrategy,
  type DiscoveryTask,
} from "@/schemas/orchestration/discovery-plan-schema";
import type { SelectedSourceGroups } from "@/schemas/source-catalogue/source-selection-schema";
import type { SourceDefinition } from "@/schemas/source-catalogue/source-definition-schema";

interface CreateDiscoveryPlanInput {
  selectedSources: SelectedSourceGroups;
  execution: ExecutionPreferences;
  pagesPerSource: SearchIntent["pagesPerSource"];
}

export function createDiscoveryPlan(
  input: CreateDiscoveryPlanInput,
): DiscoveryPlan {
  const {
    selectedSources,
    execution,
    pagesPerSource,
  } = input;

  const tasks: DiscoveryTask[] = [
    ...createTasksForStrategy({
      strategy: "ats",
      sources: selectedSources.atsSources,
      batchSize: execution.batchSize,
      pagesPerSource,
    }),

    ...createTasksForStrategy({
      strategy: "company_career",
      sources:
        selectedSources.companyCareerSources,
      batchSize: execution.batchSize,
      pagesPerSource,
    }),
  ];

  if (tasks.length === 0) {
    throw new Error(
      "No enabled sources are available for the selected discovery scope.",
    );
  }

  return discoveryPlanSchema.parse({
    tasks,
  });
}

interface CreateTasksForStrategyInput {
  strategy: DiscoveryStrategy;
  sources: SourceDefinition[];
  batchSize: number;
  pagesPerSource: number;
}

function createTasksForStrategy(
  input: CreateTasksForStrategyInput,
): DiscoveryTask[] {
  const {
    strategy,
    sources,
    batchSize,
    pagesPerSource,
  } = input;

  const sourceBatches = createBatches(
    sources,
    batchSize,
  );

  return sourceBatches.map(
    (sourceBatch, batchIndex) => ({
      id: `${strategy}-batch-${batchIndex + 1}`,
      strategy,
      sourceIds: sourceBatch.map(
        (source) => source.id,
      ),
      pagesPerSource,
    }),
  );
}

function createBatches<T>(
  items: T[],
  batchSize: number,
): T[][] {
  const batches: T[][] = [];

  for (
    let startIndex = 0;
    startIndex < items.length;
    startIndex += batchSize
  ) {
    batches.push(
      items.slice(
        startIndex,
        startIndex + batchSize,
      ),
    );
  }

  return batches;
}