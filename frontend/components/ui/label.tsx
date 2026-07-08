import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={["mb-2 block text-sm font-medium text-slate-700", className].join(" ")}
      {...props}
    />
  );
}
