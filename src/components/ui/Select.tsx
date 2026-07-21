import type {
  SelectHTMLAttributes,
} from "react";

type SelectProps =
  SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      className={[
        "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-500",
        className,
      ].join(" ")}
      {...props}
    />
  );
}