import { parse } from "@conform-to/zod";
import { type DataFunctionArgs, json, redirect } from "@remix-run/node";

import { themeFormSchema } from "~/hooks/useTheme.ts";
import { setTheme } from "~/lib/theme.server.ts";

export async function action({ request }: DataFunctionArgs) {
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

export const loader = () => redirect("/", { status: 404 });