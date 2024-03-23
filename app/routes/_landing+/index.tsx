import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { InputConform } from "~/components/conform/input.tsx";
import { Field, FieldError } from "~/components/field.tsx";
import { H1, Lead } from "~/components/typography.tsx";
import { Button } from "~/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.tsx";
import { Label } from "~/components/ui/label.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs.tsx";
import { isPresent } from "~/lib/typeGuards.ts";
import {
  CharacterLinkUrlSchema,
  getReportLinkData,
  GuildLinkUrlSchema,
  type ReportLinkUrl,
  ReportLinkUrlSchema,
  WarcraftLogsLinkUrlSchema,
} from "~/lib/wcl-links.ts";

function redirectToReportLink(url: ReportLinkUrl) {
  const reportLinkData = getReportLinkData(url);

  const redirectUrl = [
    "reports",
    reportLinkData.reportCode,
    reportLinkData.fight,
    reportLinkData.player,
  ]
    .filter(isPresent)
    .join("/");

  return redirect(`/${redirectUrl}`);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: WarcraftLogsLinkUrlSchema,
  });

  invariantResponse(submission.status === "success", "Invalid url received");

  const url = submission.value;

  switch (url.type) {
    case "character":
      throw new Response("Character URLs not currently supported", {
        status: 400,
      });
    case "guild":
      throw new Response("Guild URLs not currently supported", { status: 400 });
    case "report":
      return redirectToReportLink(url);
  }
}

function CharacterForm() {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "wcl-character-link",
    // Sync the result of last submission
    lastResult,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CharacterLinkUrlSchema });
    },
    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <Card>
        <CardHeader>
          <CardTitle>Character</CardTitle>
          <CardDescription>
            Paste a WarcraftLogs character link below and hit submit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input type="hidden" name="type" value="character" />
          <Field>
            <Label htmlFor={fields.url.id}>WarcraftLogs Character URL</Label>
            <InputConform disabled meta={fields.url} type="text" />
            <FieldError>Coming soon!</FieldError>
            {fields.url.errors ? (
              <FieldError>{fields.url.errors}</FieldError>
            ) : null}
          </Field>
        </CardContent>
        <CardFooter>
          <Button disabled type="submit">
            Analyze
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}

function GuildForm() {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "wcl-character-link",
    // Sync the result of last submission
    lastResult,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: GuildLinkUrlSchema });
    },
    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <Card>
        <CardHeader>
          <CardTitle>Character</CardTitle>
          <CardDescription>
            Paste a WarcraftLogs guild link below and hit submit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input type="hidden" name="type" value="guild" />
          <Field>
            <Label htmlFor={fields.url.id}>WarcraftLogs Guild URL</Label>
            <InputConform disabled meta={fields.url} type="text" />
            <FieldError>Coming soon!</FieldError>
            {fields.url.errors ? (
              <FieldError>{fields.url.errors}</FieldError>
            ) : null}
          </Field>
        </CardContent>
        <CardFooter>
          <Button disabled type="submit">
            Analyze
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}

function ReportForm() {
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    id: "wcl-report-link",
    // Sync the result of last submission
    lastResult,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ReportLinkUrlSchema });
    },
    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
  });

  return (
    <Form method="post" {...getFormProps(form)}>
      <Card>
        <CardHeader>
          <CardTitle>Report</CardTitle>
          <CardDescription>
            Paste a WarcraftLogs report link below and hit submit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input type="hidden" name="type" value="report" />
          <Field>
            <Label htmlFor={fields.url.id}>WarcraftLogs Report URL</Label>
            <InputConform
              meta={fields.url}
              type="text"
              placeholder="https://www.warcraftlogs.com/reports/<report code>"
            />
            {fields.url.errors ? (
              <FieldError>{fields.url.errors}</FieldError>
            ) : null}
          </Field>
        </CardContent>
        <CardFooter>
          <Button type="submit">Analyze</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}

export default function IndexRoute() {
  return (
    <>
      <div className="flex flex-col items-center pb-8 space-y-2">
        <H1>Can&apos;t touch this.</H1>
        <Lead>
          Dodge, parry, and miss analysis/leaderboards for instanced World of
          Warcraft content.
        </Lead>
      </div>
      <section className="flex flex-col h-full items-center justify-center gap-2">
        <Tabs defaultValue="report" className="w-full sm:w-[600px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="character">Character</TabsTrigger>
            <TabsTrigger value="guild">Guild</TabsTrigger>
          </TabsList>
          <TabsContent value="character">
            <CharacterForm />
          </TabsContent>
          <TabsContent value="guild">
            <GuildForm />
          </TabsContent>
          <TabsContent value="report">
            <ReportForm />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
