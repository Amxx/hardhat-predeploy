import { register } from "node:module";
import { URL } from "node:url";

const missing = new URL(import.meta.url).searchParams.get("missing")?.split(",") ?? [];

export async function resolve(specifier, context, nextResolve) {
  if (missing.includes(specifier)) {
    throw new Error(`Cannot find module '${specifier}' (simulated missing)`);
  } else {
    return nextResolve(specifier, context);
  }
}

export default function (...missing: string[]): void {
  register(new URL(`./missing-loader.ts?missing=${missing.join()}`, import.meta.url), { parentURL: import.meta.url });
}
