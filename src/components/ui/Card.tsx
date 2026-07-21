import type {
  HTMLAttributes,
} from "react";

type CardProps =
  HTMLAttributes<HTMLDivElement>;

export function Card({
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-zinc-800 bg-zinc-900 p-6",
        className,
      ].join(" ")}
      {...props}
    />
  );
}