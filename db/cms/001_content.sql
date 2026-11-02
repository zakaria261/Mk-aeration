CREATE TABLE IF NOT EXISTS cms_members (
  email text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','editor')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cms_posts (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('realisation','actualite')),
  slug text NOT NULL UNIQUE,
  owner_email text NOT NULL REFERENCES cms_members(email),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  draft jsonb NOT NULL,
  published jsonb,
  version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE INDEX IF NOT EXISTS cms_posts_public ON cms_posts(published_at DESC) WHERE published IS NOT NULL;
CREATE INDEX IF NOT EXISTS cms_posts_owner ON cms_posts(owner_email,updated_at DESC);
CREATE TABLE IF NOT EXISTS cms_media (
  id uuid PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES cms_posts(id),
  owner_email text NOT NULL REFERENCES cms_members(email),
  object_key text NOT NULL UNIQUE,
  filename text NOT NULL,
  mime text NOT NULL,
  expected_size integer NOT NULL,
  width integer,
  height integer,
  ready boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cms_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_email text NOT NULL,
  action text NOT NULL,
  post_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cms_rate_limits (
  key text PRIMARY KEY, count integer NOT NULL DEFAULT 1, expires_at timestamptz NOT NULL
);
INSERT INTO cms_members (email,name,role) VALUES ('mk.aeration@hotmail.com','MK Aération','admin') ON CONFLICT DO NOTHING;
