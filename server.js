'use strict';
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => console.error('DB pool error:', err.message));

const ENC_KEY = crypto.scryptSync(
  process.env.SESSION_SECRET || 'dev-secret',
  'aia-enc-salt-v1', 32
);

function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const c = crypto.createCipheriv('aes-256-cbc', ENC_KEY, iv);
  const enc = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return iv.toString('hex') + ':' + enc.toString('hex');
}

function decrypt(stored) {
  if (!stored || !stored.includes(':')) return '';
  try {
    const [ivHex, encHex] = stored.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const enc = Buffer.from(encHex, 'hex');
    const d = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, iv);
    return Buffer.concat([d.update(enc), d.final()]).toString('utf8');
  } catch { return ''; }
}

function hashPw(pw) {
  return crypto.createHash('sha256')
    .update(pw + 'aia-pw-salt-2024')
    .digest('hex');
}

const q = (sql, params) => pool.query(sql, params);

async function listClients() {
  const { rows } = await q(`
    SELECT c.id, c.slug, c.nom, c.secteur, c.agent_nom,
           c.color, c.dark_color, c.actif, c.created_at,
           COUNT(p.id)::int AS nb_produits
    FROM clients c
    LEFT JOIN produits p ON p.client_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `);
  return rows;
}

async function getClientBySlug(slug) {
  const { rows } = await q(
    'SELECT * FROM clients WHERE slug=$1 AND actif=true', [slug]
  );
  return rows[0] || null;
}

async function getClientById(id) {
  const { rows } = await q('SELECT * FROM clients WHERE id=$1', [id]);
  return rows[0] || null;
}

async function createClient({ slug, nom, secteur, agent_nom, color, dark_color, instructions, api_key, pw_admin, pw_commercial }) {
  const { rows } = await q(`
    INSERT INTO clients (slug, nom, secteur, agent_nom, color, dark_color, instructions, api_key_enc, pw_admin_hash, pw_commercial_hash)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
  `, [slug, nom, secteur||'', agent_nom||'Agent', color||'#E8761A', dark_color||'#1a1a1a', instructions||'', encrypt(api_key||''), hashPw(pw_admin||'admin123'), hashPw(pw_commercial||'vendeur123')]);
  return rows[0].id;
}

async function updateClient(id, fields) {
  const sets = [], vals = [];
  let i = 1;
  const map = { nom:'nom', secteur:'secteur', agent_nom:'agent_nom', color:'color', dark_color:'dark_color', instructions:'instructions', actif:'actif' };
  for (const [k, col] of Object.entries(map)) {
    if (fields[k] !== undefined) { sets.push(`${col}=$${i++}`); vals.push(fields[k]); }
  }
  if (fields.api_key) { sets.push(`api_key_enc=$${i++}`); vals.push(encrypt(fields.api_key)); }
  if (fields.pw_admin) { sets.push(`pw_admin_hash=$${i++}`); vals.push(hashPw(fields.pw_admin)); }
  if (fields.pw_commercial) { sets.push(`pw_commercial_hash=$${i++}`); vals.push(hashPw(fields.pw_commercial)); }
  if (!sets.length) return;
  vals.push(id);
  await q(`UPDATE clients SET ${sets.join(',')} WHERE id=$${i}`, vals);
}

async function deleteClient(id) {
  await q('DELETE FROM clients WHERE id=$1', [id]);
}

async function getProduits(client_id) {
  const { rows } = await q('SELECT * FROM produits WHERE client_id=$1 ORDER BY ordre,id', [client_id]);
  return rows;
}

async function setProduits(client_id, list) {
  await q('DELETE FROM produits WHERE client_id=$1', [client_id]);
  if (!list?.length) return;
  const vals = list.flatMap((p, i) => [client_id, p.nom||'', p.description||'', p.prix||'', p.disponibilite||'En stock', p.type||'must', i]);
  const ph = list.map((_, i) => `($${i*7+1},$${i*7+2},$${i*7+3},$${i*7+4},$${i*7+5},$${i*7+6},$${i*7+7})`).join(',');
  await q(`INSERT INTO produits (client_id,nom,description,prix,disponibilite,type,ordre) VALUES ${ph}`, vals);
}

async function getExemples(client_id) {
  const { rows } = await q('SELECT * FROM exemples WHERE client_id=$1 ORDER BY ordre,id', [client_id]);
  return rows;
}

async function setExemples(client_id, list) {
  await q('DELETE FROM exemples WHERE client_id=$1', [client_id]);
  if (!list?.length) return;
  const vals = list.flatMap((e, i) => [client_id, e.emoji||'🔧', e.texte||'', i]);
  const ph = list.map((_, i) => `($${i*4+1},$${i*4+2},$${i*4+3},$${i*4+4})`).join(',');
  await q(`INSERT INTO exemples (client_id,emoji,texte,ordre) VALUES ${ph}`, vals);
}

async function checkPassword(slug, role, password) {
  const client = await getClientBySlug(slug);
  if (!client) return null;
  const hash = hashPw(password);
  if (role === 'admin' && hash === client.pw_admin_hash) return client;
  if (role === 'commercial' && hash === client.pw_commercial_hash) return client;
  return null;
}

async function getPublicConfig(client_id) {
  const client = await getClientById(client_id);
  if (!client) return null;
  const produits = await getProduits(client_id);
  const exemples = await getExemples(client_id);
  return { agent_nom: client.agent_nom, nom: client.nom, secteur: client.secteur, color: client.color, dark_color: client.dark_color, instructions: client.instructions, produits, exemples };
}

async function getApiKey(client_id) {
  const client = await getClientById(client_id);
  return decrypt(client?.api_key_enc || '') || process.env.ANTHROPIC_API_KEY || '';
}

module.exports = { pool, hashPw, encrypt, decrypt, listClients, getClientBySlug, getClientById, createClient, updateClient, deleteClient, getProduits, setProduits, getExemples, setExemples, checkPassword, getPublicConfig, getApiKey };
