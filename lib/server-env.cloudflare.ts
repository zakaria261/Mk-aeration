import { env } from "cloudflare:workers";
import type { ServerEnv } from "./server-env.types";

// Vite selects this module for Sites; native Next.js uses server-env.ts.
export function getServerEnv(): ServerEnv {
  return env;
}

export function getClientIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") || "local";
}
