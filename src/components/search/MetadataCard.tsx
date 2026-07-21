interface MetadataCardProps {
  label: string;
  value: string;
}

export function MetadataCard({
  label,
  value,
}: MetadataCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-1 break-all text-zinc-200">
        {value}
      </p>
    </div>
  );
}