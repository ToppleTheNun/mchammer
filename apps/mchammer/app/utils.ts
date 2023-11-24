import { intervalToDuration } from "date-fns";

export function getReportCode(input: string): string | undefined {
  const match = input
    .trim()
    .match(
      /^(.*reports\/)?([a:]{2}([a-zA-Z0-9]{16})|([a-zA-Z0-9]{16}))\/?(#.*)?$/,
    );
  return match?.at(2);
}

export function typedKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof typeof obj>;
}

export function formatDuration(millis: number): string {
  const duration = intervalToDuration({ start: 0, end: millis });

  const hours = String(duration.hours ?? 0).padStart(2, "0");
  const minutes = String(duration.minutes ?? 0).padStart(2, "0");
  const seconds = String(duration.seconds ?? 0).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);
}
