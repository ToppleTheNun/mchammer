import "dotenv/config";

import * as fs from "node:fs";
import process from "node:process";

import { installGlobals } from "@remix-run/node";
import closeWithGrace from "close-with-grace";
import { red } from "kleur/colors";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install({
  retrieveSourceMap: function (source) {
    // get source file without the `file://` prefix or `?t=...` suffix
    const match = source.match(/^file:\/\/(.*)\?t=[.\d]+$/);
    if (match) {
      return {
        url: source,
        map: fs.readFileSync(`${match[1]}.map`, "utf8"),
      };
    }
    return null;
  },
});

installGlobals();

closeWithGrace(async ({ err }) => {
  if (err) {
    console.error(red(err.toString()));
    console.error(red(err.stack));
    process.exit(1);
  }
});

if (process.env.NODE_ENV === "production") {
  await import("./server-build/index.js");
} else {
  await import("./server/index.ts");
}
