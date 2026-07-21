"use client";

import {
  type FormEvent,
  useState,
} from "react";

import { PromptEditor } from "@/components/search/PromptEditor";
import { ProviderSelect } from "@/components/search/ProviderSelect";
import { Button } from "@/components/ui/Button";
import type {
  LlmProviderName,
  SearchRequest,
} from "@/schemas/agent/search-request-schema";

interface SearchFormProps {
  defaultProvider: LlmProviderName;
  defaultSystemPrompt: string;
  defaultUserPrompt: string;
  isSubmitting: boolean;
  onSubmit: (
    request: SearchRequest,
  ) => Promise<void>;
}

export function SearchForm({
  defaultProvider,
  defaultSystemPrompt,
  defaultUserPrompt,
  isSubmitting,
  onSubmit,
}: SearchFormProps) {
  const [provider, setProvider] =
    useState<LlmProviderName>(
      defaultProvider,
    );

  const [systemPrompt, setSystemPrompt] =
    useState(defaultSystemPrompt);

  const [userPrompt, setUserPrompt] =
    useState(defaultUserPrompt);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      provider,
      systemPrompt,
      userPrompt,
    });
  }

  const isDisabled =
    isSubmitting ||
    systemPrompt.trim().length === 0 ||
    userPrompt.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <ProviderSelect
        value={provider}
        disabled={isSubmitting}
        onChange={setProvider}
      />

      <PromptEditor
        id="systemPrompt"
        label="System prompt"
        value={systemPrompt}
        rows={12}
        disabled={isSubmitting}
        monospace
        onChange={setSystemPrompt}
      />

      <PromptEditor
        id="userPrompt"
        label="User prompt"
        value={userPrompt}
        rows={5}
        disabled={isSubmitting}
        onChange={setUserPrompt}
      />

      <Button
        type="submit"
        disabled={isDisabled}
      >
        {isSubmitting
          ? "Generating..."
          : "Generate search intent"}
      </Button>
    </form>
  );
}