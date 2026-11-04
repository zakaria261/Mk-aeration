CREATE TABLE IF NOT EXISTS cms_pages (
  key text PRIMARY KEY CHECK (key = 'home'),
  draft jsonb NOT NULL,
  published jsonb,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
