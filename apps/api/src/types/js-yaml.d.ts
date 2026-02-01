declare module "js-yaml" {
  export function load(str: string, options?: object): unknown;
  export function dump(obj: unknown, options?: { lineWidth?: number }): string;
  const yaml: { load: typeof load; dump: typeof dump };
  export default yaml;
}
