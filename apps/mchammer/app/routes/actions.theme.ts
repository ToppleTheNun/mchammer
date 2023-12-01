import type { Submission } from "@conform-to/dom";
import { parse } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import type { DataFunctionArgs, TypedResponse } from "@remix-run/node";
import { route } from "routes-gen";

import { themeFormSchema } from "#app/hooks/useTheme.ts";
import { setTheme } from "#app/lib/theme.server.ts";

export type ThemeSubmission = Submission<{ theme: "system" | "dark" | "light" }>;
export type SetThemeActionResult = Promise<TypedResponse<{ readonly status: "idle", readonly submission: ThemeSubmission } | { readonly status: "error", readonly submission: ThemeSubmission } | { readonly success: boolean, readonly submission: ThemeSubmission }>>;

export async function action({ request }: DataFunctionArgs): SetThemeActionResult {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: themeFormSchema,
  });
  if (submission.intent !== "submit")
    return json({ status: "idle", submission } as const);

  if (!submission.value)
    return json({ status: "error", submission } as const, { status: 400 });

  const { theme } = submission.value;

  const responseInit = {
    headers: { "set-cookie": setTheme(theme) },
  };
  return json({ success: true, submission }, responseInit);
}

export const loader = () => redirect(route("/"), { status: 404 });
