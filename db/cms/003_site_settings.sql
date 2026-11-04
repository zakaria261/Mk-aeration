CREATE TABLE IF NOT EXISTS cms_site_settings (
 key text PRIMARY KEY CHECK (key='site'), draft jsonb NOT NULL, published jsonb,
 published_media uuid[] NOT NULL DEFAULT '{}', version integer NOT NULL DEFAULT 1,
 updated_at timestamptz NOT NULL DEFAULT now(), updated_by text NOT NULL REFERENCES cms_members(email)
);
CREATE TABLE IF NOT EXISTS cms_site_history (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor_email text NOT NULL,
 action text NOT NULL, snapshot jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE cms_media ALTER COLUMN post_id DROP NOT NULL;
CREATE TABLE IF NOT EXISTS cms_contacts (
 id uuid PRIMARY KEY, reference text NOT NULL, name text NOT NULL, email text NOT NULL,
 phone text NOT NULL DEFAULT '', message text NOT NULL, ip_hash text NOT NULL,
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','replied','archived')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_contacts_date ON cms_contacts(created_at DESC);
