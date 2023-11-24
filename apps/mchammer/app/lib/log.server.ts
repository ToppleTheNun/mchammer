import { cyan, green, red, yellow } from "kleur/colors";

export const tags = {
  error: red("mchammer:error"),
  warn: yellow("mchammer:warn"),
  debug: green("mchammer:debug"),
  info: cyan("mchammer:info"),
};

export function info(message: any, ...optionalParams: any[]) {
  console.info(`${tags.info} ${message}`, ...optionalParams);
}
export function error(message: any, ...optionalParams: any[]) {
  console.error(`${tags.error} ${message}`, ...optionalParams);
}
export function warn(message: any, ...optionalParams: any[]) {
  console.log(`${tags.warn} ${message}`, ...optionalParams);
}
export function debug(message: any, ...optionalParams: any[]) {
  console.log(`${tags.debug} ${message}`, ...optionalParams);
}
