import type {
  TextareaHTMLAttributes,
} from "react";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  className = "",
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={[
        "w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-3 outline-none focus:border-zinc-500",
        className,
      ].join(" ")}
      {...props}
    />
  );
}