import { Select } from "@/components/ui/Select";
import type { LlmProviderName } from "@/schemas/agent/search-request-schema";
import { CONSTANTS } from "@/shared/constants";

interface ProviderSelectProps {
  value: LlmProviderName;
  disabled?: boolean;
  onChange: (
    provider: LlmProviderName,
  ) => void;
}

export function ProviderSelect({
  value,
  disabled = false,
  onChange,
}: ProviderSelectProps) {
  return (
    <div>
      <label
        htmlFor="provider"
        className="mb-2 block text-sm font-medium"
      >
        Provider
      </label>

      <Select
        id="provider"
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(
            event.target.value as LlmProviderName,
          );
        }}
      >
        <option
          value={
            CONSTANTS.LLM.PROVIDERS.OPENAI
          }
        >
          OpenAI
        </option>

        <option
          value={
            CONSTANTS.LLM.PROVIDERS.OLLAMA
          }
        >
          Ollama
        </option>

        <option
          value={
            CONSTANTS.LLM.PROVIDERS.GEMINI
          }
        >
          Gemini
        </option>
      </Select>
    </div>
  );
}