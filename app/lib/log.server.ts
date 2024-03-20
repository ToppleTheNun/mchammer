import { cyan, green, red, yellow } from "kleur/colors";

export const tags = {
  error: red("mchammer:error"),
  warn: yellow("mchammer:warn"),
  debug: green("mchammer:debug"),
  info: cyan("mchammer:info"),
};

export const info = (message: string, ...optionalParams: unknown[]) => {
  console.info(`${tags.info} ${message}`, ...optionalParams);
};
export const error = (message: string, ...optionalParams: unknown[]) => {
  console.error(`${tags.error} ${message}`, ...optionalParams);
};
export const warn = (message: string, ...optionalParams: unknown[]) => {
  console.warn(`${tags.warn} ${message}`, ...optionalParams);
};
export const debug = (message: string, ...optionalParams: unknown[]) => {
  console.log(`${tags.debug} ${message}`, ...optionalParams);
};
