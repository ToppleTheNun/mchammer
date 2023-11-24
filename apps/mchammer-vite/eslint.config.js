import antfu from "@antfu/eslint-config";

export default await antfu({
  stylistic: {
    semi: true,
    quotes: "double",
  },
}, {
  files: [`other/**/*.ts`],
  name: "topplethenun:other-overrides",
  rules: {
    "no-console": "off",
  },
}, {
  files: [`**/*.server.ts`],
  name: "topplethenun:server-overrides",
  rules: {
    "no-console": "off",
  },
});