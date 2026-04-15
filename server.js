'use strict';
const express     = require('express');
const session     = require('express-session');
const PgSession   = require('connect-pg-simple')(session);
const fetch       = require('node-fetch');
const crypto      = require('crypto');
const fs          = require('fs');
const path        = require('path');
const db          = require('./src/db');

const app  = express();
const PORT = process.env.PORT || 3000;
const SUPER_PW = process.env.SUPER_ADMIN_PASSWORD || 'superadmin123';

// ── Middlewares ────────────────────────────────────────────────
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: new PgSession({
    pool: db.pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 60 * 1000, // 10h
  },
}));
app.use(express.static(path.join(__dirname, 'public')));

// ── Auth guards ────────────────────────────────────────────────
function guardSuper(req, res, next) {
  if (req.session.role === 'superadmin') return next();
  res.status(401).json({ error: 'Accès refusé' });
}
function guardClient(req, res, next) {
  if (['admin','commercial','superadmin'].includes(req.session.role)) return next();
  res.status(401).json({ error: 'Non connecté' });
}
function guardAdmin(req, res, next) {
  if (['admin','superadmin'].includes(req.session.role)) return next();
  res.status(401).json({ error: 'Accès admin requis' });
}
function slugMatch(req, res, next) {
  if (req.session.role === 'superadmin') return next();
  if (req.session.slug === req.params.slug) return next();
  res.status(403).json({ error: 'Accès interdit' });
}

// ══════════════════════════════════════════════════════════════
//  ROUTES AUTH
// ══════════════════════════════════════════════════════════════

// Super admin login
app.post('/api/auth/superadmin', (req, res) => {
  const { password } = req.body;
  const hash = db.hashPw(password);
  const expected = db.hashPw(SUPER_PW);
  if (hash !== expected) return res.status(401).json({ error: 'Mot de passe incorrect' });
  req.session.role = 'superadmin';
  req.session.slug = null;
  req.session.client_id = null;
  res.json({ ok: true });
});

// Client login (admin ou commercial)
app.post('/api/auth/:slug/login', async (req, res) => {
  const { slug } = req.params;
  const { password, role } = req.body;
  if (!['admin','commercial'].includes(role))
    return res.status(400).json({ error: 'Rôle invalide' });
  try {
    const client = await db.checkPassword(slug, role, password);
    if (!client) return res.status(401).json({ error: 'Mot de passe incorrect' });
    req.session.role      = role;
    req.session.slug      = slug;
    req.session.client_id = client.id;
    res.json({ ok: true, role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    role:      req.session.role || null,
    slug:      req.session.slug || null,
    client_id: req.session.client_id || null,
  });
});

// ══════════════════════════════════════════════════════════════
//  ROUTES SUPER ADMIN
// ══════════════════════════════════════════════════════════════

app.get('/api/superadmin/clients', guardSuper, async (req, res) => {
  try { res.json(await db.listClients()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/superadmin/clients', guardSuper, async (req, res) => {
  try {
    const id = await db.createClient(req.body);
    // Catalogue par défaut
    await db.setProduits(id, DEFAULT_CATALOGUE);
    await db.setExemples(id, DEFAULT_EXEMPLES);
    res.json({ ok: true, id });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ce slug est déjà utilisé' });
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/superadmin/clients/:id', guardSuper, async (req, res) => {
  try {
    await db.updateClient(parseInt(req.params.id), req.body);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/superadmin/clients/:id', guardSuper, async (req, res) => {
  try {
    await db.deleteClient(parseInt(req.params.id));
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  ROUTES CLIENT
// ══════════════════════════════════════════════════════════════

// Config publique (commercial + admin)
app.get('/api/:slug/config', guardClient, slugMatch, async (req, res) => {
  try {
    const cfg = await db.getPublicConfig(req.session.client_id);
    if (!cfg) return res.status(404).json({ error: 'Client introuvable' });
    res.json(cfg);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Mise à jour config (admin seulement)
app.post('/api/:slug/config', guardAdmin, slugMatch, async (req, res) => {
  try {
    const id  = req.session.client_id;
    const {
      agent_nom, nom, secteur, color, dark_color, instructions,
      api_key, pw_admin, pw_commercial,
      produits, exemples,
    } = req.body;

    await db.updateClient(id, {
      agent_nom, nom, secteur, color, dark_color, instructions,
      api_key: api_key?.trim() || undefined,
      pw_admin: pw_admin?.trim() || undefined,
      pw_commercial: pw_commercial?.trim() || undefined,
    });
    if (produits !== undefined) await db.setProduits(id, produits);
    if (exemples !== undefined) await db.setExemples(id, exemples);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Chat — proxy sécurisé vers Anthropic
app.post('/api/:slug/chat', guardClient, slugMatch, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.length > 2000)
      return res.status(400).json({ error: 'Requête invalide' });

    const apiKey = await db.getApiKey(req.session.client_id);
    if (!apiKey)
      return res.status(500).json({ error: 'Clé API non configurée. Contactez votre administrateur.' });

    const cfg      = await db.getPublicConfig(req.session.client_id);
    const catText  = cfg.produits.map(p =>
      `- ${p.nom} : ${p.description} · ${p.prix} · ${p.disponibilite} [${p.type}]`
    ).join('\n');
    const instr    = cfg.instructions
      ? `\nINSTRUCTIONS SPÉCIALES :\n${cfg.instructions}` : '';

    const prompt = `Tu es ${cfg.agent_nom}, assistant commercial expert chez ${cfg.nom} (${cfg.secteur}).
MISSION : ne jamais laisser repartir un client sans TOUT ce qu'il faut pour finir son projet.${instr}

Demande du vendeur : "${query}"

Réponds UNIQUEMENT en JSON valide strict, sans markdown :
{
  "analyse": "Reformulation du besoin réel, 1-2 phrases",
  "script": "Ce que le vendeur dit au client, naturel, 2-3 phrases",
  "kit": [
    {"type":"must|up|warn","emoji":"🔨","nom":"Nom exact","pourquoi":"Raison 10 mots max","prix":"Prix","stock":"En stock|Sur commande"}
  ],
  "oubli": "Produit que 80% des clients oublient + explication",
  "objections": [{"q":"Objection","r":"Réponse courte"}],
  "astuce": "Info technique cruciale, 2 phrases max",
  "panier": "Montant total estimé en €"
}

TYPES : must=indispensable · up=conseillé · warn=absence = échec du projet
RÈGLES : 5 à 10 produits, uniquement depuis le catalogue, penser type de support/poids/contexte

CATALOGUE :
${catText}`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.error?.message || 'Erreur API' });

    const text = data.content?.[0]?.text || '{}';
    let parsed;
    try { parsed = JSON.parse(text.replace(/```json|```/g, '').trim()); }
    catch { parsed = { analyse: text }; }

    res.json({ ok: true, data: parsed });
  } catch (e) {
    console.error('Chat error:', e.message);
    res.status(500).json({ error: 'Erreur de connexion à l\'API.' });
  }
});

// ══════════════════════════════════════════════════════════════
//  ROUTES HTML
// ══════════════════════════════════════════════════════════════

const clientHtml    = fs.readFileSync(path.join(__dirname, 'public', 'client.html'), 'utf8');
const superAdmHtml  = fs.readFileSync(path.join(__dirname, 'public', 'superadmin.html'), 'utf8');

app.get('/', (req, res) => res.redirect('/superadmin'));

app.get('/superadmin', (req, res) => res.send(superAdmHtml));

app.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  if (slug === 'superadmin') return res.send(superAdmHtml);
  const client = await db.getClientBySlug(slug).catch(() => null);
  if (!client) return res.status(404).send('<h2>Client introuvable</h2>');
  // Injecter le slug dans la page HTML
  res.send(clientHtml.replace('__SLUG__', slug).replace('__NOM__', client.nom));
});

// ══════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`\n✅  Assistant Commercial IA SaaS — http://localhost:${PORT}`);
  console.log(`    Super admin : /superadmin`);
  console.log(`    Mot de passe super admin : ${SUPER_PW}`);
  console.log(`\n    → Changez SUPER_ADMIN_PASSWORD dans vos variables d'environnement\n`);
});

// ══════════════════════════════════════════════════════════════
//  DONNÉES PAR DÉFAUT (appliquées à chaque nouveau client)
// ══════════════════════════════════════════════════════════════
const DEFAULT_CATALOGUE = [
  { nom:'Perceuse Bosch 18V Pro',      description:'2 batteries incluses',           prix:'189€',   disponibilite:'En stock',     type:'must' },
  { nom:'Perceuse SDS+ Bosch 800W',    description:'Perçage béton et pierre',        prix:'149€',   disponibilite:'En stock',     type:'must' },
  { nom:'Chevilles nylon 6mm x100',    description:'Mur standard',                   prix:'5€',     disponibilite:'En stock',     type:'warn' },
  { nom:'Chevilles béton 8mm x50',     description:'Mur béton armé',                 prix:'7€',     disponibilite:'En stock',     type:'warn' },
  { nom:'Chevilles Molly placo x20',   description:'Cloisons creuses',               prix:'9€',     disponibilite:'En stock',     type:'warn' },
  { nom:'Set forets béton 4-8mm',      description:'7 pièces, usage universel',      prix:'19€',    disponibilite:'En stock',     type:'must' },
  { nom:'Foret SDS+ 8x160mm',          description:'Perçage profond béton armé',     prix:'12€',    disponibilite:'En stock',     type:'must' },
  { nom:'Vis acier 4x40mm x200',       description:'Usage général',                  prix:'6€',     disponibilite:'En stock',     type:'must' },
  { nom:'Niveau à bulle 60cm',         description:'Pose horizontale précise',       prix:'9€',     disponibilite:'En stock',     type:'must' },
  { nom:'Mètre ruban pro 5m',          description:'Mesure et report de cotes',      prix:'9€',     disponibilite:'En stock',     type:'must' },
  { nom:'Peinture Dulux 10L',          description:'Lessivable, 30 coloris',         prix:'49€',    disponibilite:'En stock',     type:'must' },
  { nom:'Sous-couche universelle 5L',  description:'Toutes surfaces intérieures',    prix:'22€',    disponibilite:'En stock',     type:'must' },
  { nom:'Parquet stratifié chêne',     description:'12mm classe 32, pose flottante', prix:'22€/m²', disponibilite:'En stock',     type:'must' },
  { nom:'Sous-couche parquet 10m²',    description:'Isolation phonique obligatoire', prix:'18€',    disponibilite:'En stock',     type:'warn' },
  { nom:'Carrelage grès 60x60',        description:'Blanc mat, intérieur',           prix:'45€/m²', disponibilite:'En stock',     type:'must' },
  { nom:'Colle carrelage C2 25kg',     description:'Grands formats, déformable',     prix:'32€',    disponibilite:'En stock',     type:'must' },
  { nom:'Joint carrelage Mapei 5kg',   description:'Flexible, résistant humidité',   prix:'14€',    disponibilite:'En stock',     type:'must' },
  { nom:'Kit salle de bain Grohe',     description:'Meuble + miroir + robinetterie', prix:'890€',   disponibilite:'Sur commande', type:'must' },
  { nom:'Receveur douche 90x90',       description:'Extra-plat',                     prix:'149€',   disponibilite:'En stock',     type:'must' },
  { nom:'Joint silicone sanitaire',    description:'310ml blanc, salle de bain',     prix:'8€',     disponibilite:'En stock',     type:'warn' },
];
const DEFAULT_EXEMPLES = [
  { emoji:'🖼️', texte:'Accrocher un cadre lourd sur béton'  },
  { emoji:'🚿', texte:'Poser un receveur de douche'          },
  { emoji:'🪵', texte:'Poser parquet flottant 20m²'         },
  { emoji:'🎨', texte:'Repeindre salon murs + plafond'      },
  { emoji:'🔧', texte:'Fixer une étagère murale'            },
];
