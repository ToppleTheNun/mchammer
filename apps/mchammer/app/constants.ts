export const searchParamSeparator = "~";
export const lastModified = "Last-Modified";
export const cacheControl = "Cache-Control";
export const eTag = "ETag";
export const setCookie = "Set-Cookie";
export const expires = "Expires";
export const serverTiming = "Server-Timing";
export const regions = ["eu", "us", "kr", "tw"] as const;
export type Region = (typeof regions)[number];

export const isRegion = (x: string): x is Region => regions.includes(x);
