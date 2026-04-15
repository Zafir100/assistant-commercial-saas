-- ══════════════════════════════════════════════
--  Assistant Commercial IA — Schéma PostgreSQL
-- ══════════════════════════════════════════════

-- Sessions (express-session persistantes)
CREATE TABLE IF NOT EXISTS session (
  sid    VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  sess   JSON    NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);

-- Clients (tenants)
CREATE TABLE IF NOT EXISTS clients (
  id                    SERIAL PRIMARY KEY,
  slug                  VARCHAR(60)  UNIQUE NOT NULL,
  nom                   VARCHAR(120) NOT NULL,
  secteur               VARCHAR(120) DEFAULT '',
  agent_nom             VARCHAR(60)  DEFAULT 'Agent',
  color                 VARCHAR(7)   DEFAULT '#E8761A',
  dark_color            VARCHAR(7)   DEFAULT '#1a1a1a',
  instructions          TEXT         DEFAULT '',
  api_key_enc           TEXT         DEFAULT '',
  pw_admin_hash         VARCHAR(64)  NOT NULL,
  pw_commercial_hash    VARCHAR(64)  NOT NULL,
  actif                 BOOLEAN      DEFAULT true,
  created_at            TIMESTAMP    DEFAULT NOW()
);

-- Produits du catalogue (par client)
CREATE TABLE IF NOT EXISTS produits (
  id            SERIAL PRIMARY KEY,
  client_id     INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  nom           VARCHAR(200) NOT NULL,
  description   TEXT         DEFAULT '',
  prix          VARCHAR(60)  DEFAULT '',
  disponibilite VARCHAR(60)  DEFAULT 'En stock',
  type          VARCHAR(10)  DEFAULT 'must',
  ordre         INTEGER      DEFAULT 0
);

-- Exemples / raccourcis (par client)
CREATE TABLE IF NOT EXISTS exemples (
  id        SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  emoji     VARCHAR(10)  DEFAULT '🔧',
  texte     VARCHAR(200) NOT NULL,
  ordre     INTEGER      DEFAULT 0
);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_produits_client ON produits(client_id, ordre);
CREATE INDEX IF NOT EXISTS idx_exemples_client ON exemples(client_id, ordre);
