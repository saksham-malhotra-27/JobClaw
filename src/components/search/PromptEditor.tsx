import { Textarea } from "@/components/ui/Textarea";

interface PromptEditorProps {
  id: string;
  label: string;
  value: string;
  rows: number;
  disabled?: boolean;
  monospace?: boolean;
  onChange: (value: string) => void;
}

export function PromptEditor({
  id,
  label,
  value,
  rows,
  disabled = false,
  monospace = false,
  onChange,
}: PromptEditorProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <Textarea
        id={id}
        value={value}
        rows={rows}
        disabled={disabled}
        className={
          monospace
            ? "font-mono text-sm leading-6"
            : undefined
        }
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}