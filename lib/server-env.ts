import type {
  QuoteDatabase,
  QuoteStatement,
  ServerEnv,
} from "./server-env.types";

type QueryResult = {
  success: boolean;
  results?: Record<string, unknown>[];
};
type D1Response = { success: boolean; result?: QueryResult[] };
type NodeEnvironment = Record<string, string | undefined>;

export function getClientIp(
  request: Request,
  variables: NodeEnvironment = process.env,
): string {
  // Vercel overwrites x-forwarded-for at its edge. Do not trust a client-supplied
  // Cloudflare header on a Vercel or ordinary Node.js deployment.
  return variables.VERCEL === "1"
    ? request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
    : "local";
}

/** Server-side D1 REST access for Node.js hosts such as Vercel. */
export function getServerEnv(
  variables: NodeEnvironment = process.env,
): ServerEnv {
  const account = variables.CLOUDFLARE_ACCOUNT_ID;
  const database = variables.CLOUDFLARE_D1_DATABASE_ID;
  const token = variables.CLOUDFLARE_D1_API_TOKEN;
  let DB: QuoteDatabase | undefined;

  if (account && database && token) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/d1/database/${encodeURIComponent(database)}/query`;
    const statement = (sql: string, params: unknown[] = []): QuoteStatement => {
      const execute = async (): Promise<QueryResult> => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql, params }),
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error("D1 database request failed.");
        const payload = (await response.json()) as D1Response;
        const result = payload.result?.[0];
        if (!payload.success || !result?.success) {
          throw new Error("D1 database query failed.");
        }
        return result;
      };
      return {
        bind: (...values) => statement(sql, values),
        async first<T>() {
          const result = await execute();
          return (result.results?.[0] as T | undefined) ?? null;
        },
        run: execute,
      };
    };
    DB = { prepare: (sql) => statement(sql) };
  }

  return {
    DB,
    RESEND_API_KEY: variables.RESEND_API_KEY,
    QUOTE_EMAIL_FROM: variables.QUOTE_EMAIL_FROM,
  };
}
