import type { Timings } from "~/lib/timing.server.ts";

export interface Timeable {
  timings: Timings;
}

export interface CacheableQueryOptions extends Timeable {
  forceFresh?: boolean;
}
