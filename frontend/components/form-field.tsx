import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export function FormField({ label, required, error, hint, inputProps }: FormFieldProps) {
  const shared = (
    <>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={inputProps.id}>
          {label}
          {required ? " *" : ""}
        </Label>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {"rows" in inputProps ? (
        <textarea
          className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <Input {...(inputProps as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error ? <p className="mt-2 text-sm text-slate-600">{error}</p> : null}
    </>
  );

  return <div>{shared}</div>;
}
