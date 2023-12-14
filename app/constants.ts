import { z } from "zod";

export const searchParamSeparator = "~";
export const lastModified = "Last-Modified";
export const cacheControl = "Cache-Control";
export const eTag = "ETag";
export const setCookie = "Set-Cookie";
export const expires = "Expires";
export const serverTiming = "Server-Timing";
export const regionSchema = z.enum(["eu", "us", "kr", "tw"]);
export type Region = z.infer<typeof regionSchema>;

export const isRegion = (x: string): x is Region =>
  regionSchema.safeParse(x).success;
