declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/actions/theme": Record<string, never>;
    "/season/:season": { season: string };
  };

  export function route<
    T extends
      | ["/"]
      | ["/actions/theme"]
      | ["/season/:season", RouteParams["/season/:season"]],
  >(...args: T): (typeof args)[0];
}
