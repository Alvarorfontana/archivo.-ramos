CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS research_projects (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, slug text UNIQUE NOT NULL,
 description text, scope_start integer, scope_end integer, status text NOT NULL DEFAULT 'active',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sources (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, institution text, base_url text,
 source_type text NOT NULL DEFAULT 'repository', access_status text NOT NULL DEFAULT 'unverified',
 notes text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS documents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES research_projects(id) ON DELETE SET NULL,
 source_id uuid REFERENCES sources(id) ON DELETE SET NULL, title text NOT NULL, document_date date,
 country text, institution text, creator text, document_type text, language text DEFAULT 'es',
 archive_reference text, source_url text, abstract text, transcription text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 verification_status text NOT NULL DEFAULT 'unreviewed', created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents USING gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(abstract,'') || ' ' || coalesce(transcription,'')));
CREATE INDEX IF NOT EXISTS documents_date_idx ON documents(document_date);
CREATE TABLE IF NOT EXISTS actors (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), full_name text NOT NULL, actor_type text NOT NULL DEFAULT 'person',
 biography text, start_year integer, end_year integer, image_url text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS organizations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, organization_type text,
 country text, description text, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, event_date date, end_date date,
 location text, description text, event_type text, verification_status text NOT NULL DEFAULT 'unreviewed',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS relationships (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), from_actor_id uuid REFERENCES actors(id) ON DELETE CASCADE,
 to_actor_id uuid REFERENCES actors(id) ON DELETE CASCADE, organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
 event_id uuid REFERENCES events(id) ON DELETE SET NULL, relationship_type text NOT NULL,
 evidence_class text NOT NULL DEFAULT 'context', description text, valid_from date, valid_to date,
 verification_status text NOT NULL DEFAULT 'unreviewed', created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (from_actor_id IS NOT NULL OR to_actor_id IS NOT NULL OR organization_id IS NOT NULL OR event_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS claims (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES research_projects(id) ON DELETE SET NULL,
 statement text NOT NULL, claim_type text NOT NULL CHECK (claim_type IN ('fact','interpretation','allegation','hypothesis')),
 status text NOT NULL DEFAULT 'unreviewed' CHECK (status IN ('unreviewed','supported','contradicted','mixed','unresolved')),
 confidence numeric(4,3), notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS evidence (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), claim_id uuid REFERENCES claims(id) ON DELETE CASCADE,
 document_id uuid REFERENCES documents(id) ON DELETE CASCADE, page_locator text, quotation text,
 evidence_role text NOT NULL DEFAULT 'supports', notes text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS analysis_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), task text NOT NULL, model text NOT NULL,
 prompt_version text NOT NULL DEFAULT 'archive1989-v1', input_document_ids uuid[] NOT NULL DEFAULT '{}',
 output jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reports (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES research_projects(id) ON DELETE SET NULL,
 title text NOT NULL, body text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'draft',
 source_document_ids uuid[] NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS report_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 version_number integer NOT NULL, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(report_id, version_number)
);
INSERT INTO research_projects (title,slug,description,scope_start,scope_end)
VALUES ('ARCHIVO 1989','archivo-1989','Investigación documental sobre relaciones político-diplomáticas entre Argentina, México y Estados Unidos.',1983,1995)
ON CONFLICT (slug) DO NOTHING;
