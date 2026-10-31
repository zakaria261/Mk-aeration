export interface QuoteStatement {
  bind(...values: unknown[]): QuoteStatement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface QuoteDatabase {
  prepare(sql: string): QuoteStatement;
}

export interface ServerEnv {
  DB?: QuoteDatabase;
  RESEND_API_KEY?: string;
  QUOTE_EMAIL_FROM?: string;
}
