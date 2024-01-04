import { cyan, green, red, yellow } from "kleur/colors";

export const tags = {
  error: red("mchammer:error"),
  warn: yellow("mchammer:warn"),
  debug: green("mchammer:debug"),
  info: cyan("mchammer:info"),
};

export const info = (message: any, ...optionalParams: any[]) => {
  console.info(`${tags.info} ${message}`, ...optionalParams);
};
export const error = (message: any, ...optionalParams: any[]) => {
  console.error(`${tags.error} ${message}`, ...optionalParams);
};
export const warn = (message: any, ...optionalParams: any[]) => {
  console.warn(`${tags.warn} ${message}`, ...optionalParams);
};
export const debug = (message: any, ...optionalParams: any[]) => {
  console.log(`${tags.debug} ${message}`, ...optionalParams);
};
