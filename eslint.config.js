import antfu, { GLOB_JSX, GLOB_TSX } from "@antfu/eslint-config";

export default antfu(
  {
    ignores: [],
    overrides: {
      react: {
        "react/prop-types": "off",
      },
    },
    // react: true,
    stylistic: false,
  },
  {
    name: "mchammer:allow-console-log",
    files: ["other/**/*.ts", "other/**/*.js", "**/*.server.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    name: "mchammer:react-version",
    files: [GLOB_JSX, GLOB_TSX],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
);
