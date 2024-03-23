import type { ReactNode } from "react";

export function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function FieldError({ children }: { children: ReactNode }) {
  return <div className="text-sm text-red-600">{children}</div>;
}
