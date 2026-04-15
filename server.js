'use strict';
const express = require('express');
const session = require('express-session');
const fetch   = require('node-fetch');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');
const { Pool } = require('pg');

const app  = express();
const PORT = process.env.PORT || 3000;
const SUPER_PW = process.env.SUPER_ADMIN_PASSWORD || 'superadmin123';

console.log('Starting server on port', PORT);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 36000000 },
}));

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

function hashPw(pw) {
  return crypto.createHash('sha256').update(pw + 'aia-pw-salt-2024').digest('hex');
}
const ENC_KEY = crypto.scryptSync(process.env.SESSION_SECRET || 'dev-secret', 'aia-enc-salt-v1', 32);
function encrypt(t) {
  if (!t) return '';
  const iv=crypto.randomBytes(16), c=crypto.createCipheriv('aes-256-cbc',ENC_KEY,iv);
  return iv.toString('hex')+':'+Buffer.concat([c.update(t,'utf8'),c.final()]).toString('hex');
}
function decrypt(s) {
  if (!s||!s.includes(':')) return '';
  try {
    const [ih,eh]=s.split(':');
    const d=crypto.createDecipheriv('aes-256-cbc',ENC_KEY,Buffer.from(ih,'hex'));
    return Buffer.concat([d.update(Buffer.from(eh,'hex')),d.final()]).toString('utf8');
  } catch{return '';}
}

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY, slug VARCHAR(60) UNIQUE NOT NULL,
      nom VARCHAR(120) NOT NULL, secteur VARCHAR(120) DEFAULT '',
      agent_nom VARCHAR(60) DEFAULT 'Agent', color VARCHAR(7) DEFAULT '#E8761A',
      dark_color VARCHAR(7) DEFAULT '#1a1a1a', instructions TEXT DEFAULT '',
      api_key_enc TEXT DEFAULT '', pw_admin_hash VARCHAR(64) NOT NULL,
      pw_commercial_hash VARCHAR(64) NOT NULL, actif BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS produits (
      id SERIAL PRIMARY KEY, client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      nom VARCHAR(200) NOT NULL, description TEXT DEFAULT '', prix VARCHAR(60) DEFAULT '',
      disponibilite VARCHAR(60) DEFAULT 'En stock', type VARCHAR(10) DEFAULT 'must', ordre INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS exemples (
      id SERIAL PRIMARY KEY, client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      emoji VARCHAR(10) DEFAULT '🔧', texte VARCHAR(200) NOT NULL, ordre INTEGER DEFAULT 0
    );
  `);
  console.log('DB ready');
}

async function listClients() {
  const {rows}=await pool.query(`SELECT c.*,COUNT(p.id)::int AS nb_produits FROM clients c LEFT JOIN produits p ON p.client_id=c.id GROUP BY c.id ORDER BY c.created_at DESC`);
  return rows;
}
async function getBySlug(slug) { const {rows}=await pool.query('SELECT * FROM clients WHERE slug=$1 AND actif=true',[slug]); return rows[0]||null; }
async function getById(id) { const {rows}=await pool.query('SELECT * FROM clients WHERE id=$1',[id]); return rows[0]||null; }
async function createClient(d) {
  const {rows}=await pool.query(`INSERT INTO clients (slug,nom,secteur,agent_nom,color,dark_color,instructions,api_key_enc,pw_admin_hash,pw_commercial_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [d.slug,d.nom,d.secteur||'',d.agent_nom||'Agent',d.color||'#E8761A',d.dark_color||'#1a1a1a',d.instructions||'',encrypt(d.api_key||''),hashPw(d.pw_admin||'admin123'),hashPw(d.pw_commercial||'vendeur123')]);
  return rows[0].id;
}
async function updateClient(id,f) {
  const s=[],v=[];let i=1;
  const m={nom:'nom',secteur:'secteur',agent_nom:'agent_nom',color:'color',dark_color:'dark_color',instructions:'instructions',actif:'actif'};
  for(const[k,c]of Object.entries(m)){if(f[k]!==undefined){s.push(`${c}=$${i++}`);v.push(f[k]);}}
  if(f.api_key){s.push(`api_key_enc=$${i++}`);v.push(encrypt(f.api_key));}
  if(f.pw_admin){s.push(`pw_admin_hash=$${i++}`);v.push(hashPw(f.pw_admin));}
  if(f.pw_commercial){s.push(`pw_commercial_hash=$${i++}`);v.push(hashPw(f.pw_commercial));}
  if(!s.length)return;v.push(id);
  await pool.query(`UPDATE clients SET ${s.join(',')} WHERE id=$${i}`,v);
}
async function deleteClient(id){await pool.query('DELETE FROM clients WHERE id=$1',[id]);}
async function getProduits(cid){const{rows}=await pool.query('SELECT * FROM produits WHERE client_id=$1 ORDER BY ordre,id',[cid]);return rows;}
async function setProduits(cid,list){
  await pool.query('DELETE FROM produits WHERE client_id=$1',[cid]);
  if(!list?.length)return;
  const v=list.flatMap((p,i)=>[cid,p.nom||'',p.description||'',p.prix||'',p.disponibilite||'En stock',p.type||'must',i]);
  const ph=list.map((_,i)=>`($${i*7+1},$${i*7+2},$${i*7+3},$${i*7+4},$${i*7+5},$${i*7+6},$${i*7+7})`).join(',');
  await pool.query(`INSERT INTO produits (client_id,nom,description,prix,disponibilite,type,ordre) VALUES ${ph}`,v);
}
async function getExemples(cid){const{rows}=await pool.query('SELECT * FROM exemples WHERE client_id=$1 ORDER BY ordre,id',[cid]);return rows;}
async function setExemples(cid,list){
  await pool.query('DELETE FROM exemples WHERE client_id=$1',[cid]);
  if(!list?.length)return;
  const v=list.flatMap((e,i)=>[cid,e.emoji||'🔧',e.texte||'',i]);
  const ph=list.map((_,i)=>`($${i*4+1},$${i*4+2},$${i*4+3},$${i*4+4})`).join(',');
  await pool.query(`INSERT INTO exemples (client_id,emoji,texte,ordre) VALUES ${ph}`,v);
}
async function checkPw(slug,role,pw){
  const c=await getBySlug(slug);if(!c)return null;
  const h=hashPw(pw);
  if(role==='admin'&&h===c.pw_admin_hash)return c;
  if(role==='commercial'&&h===c.pw_commercial_hash)return c;
  return null;
}

const gS=(r,e,n)=>r.session.role==='superadmin'?n():e.status(401).json({error:'Refusé'});
const gC=(r,e,n)=>['admin','commercial','superadmin'].includes(r.session.role)?n():e.status(401).json({error:'Non connecté'});
const gA=(r,e,n)=>['admin','superadmin'].includes(r.session.role)?n():e.status(401).json({error:'Admin requis'});
const gM=(r,e,n)=>(r.session.role==='superadmin'||r.session.slug===r.params.slug)?n():e.status(403).json({error:'Interdit'});

app.get('/health',(req,res)=>res.json({ok:true}));

app.post('/api/auth/superadmin',(req,res)=>{
  if(hashPw(req.body.password)!==hashPw(SUPER_PW))return res.status(401).json({error:'Mot de passe incorrect'});
  req.session.role='superadmin';res.json({ok:true});
});
app.post('/api/auth/:slug/login',async(req,res)=>{
  const{slug}=req.params,{password,role}=req.body;
  if(!['admin','commercial'].includes(role))return res.status(400).json({error:'Rôle invalide'});
  try{const c=await checkPw(slug,role,password);if(!c)return res.status(401).json({error:'Mot de passe incorrect'});
    req.session.role=role;req.session.slug=slug;req.session.client_id=c.id;res.json({ok:true,role});}
  catch(e){res.status(500).json({error:e.message});}
});
app.post('/api/auth/logout',(req,res)=>{req.session.destroy(()=>res.json({ok:true}));});
app.get('/api/auth/me',(req,res)=>res.json({role:req.session.role||null,slug:req.session.slug||null,client_id:req.session.client_id||null}));

app.get('/api/superadmin/clients',gS,async(req,res)=>{try{res.json(await listClients());}catch(e){res.status(500).json({error:e.message});}});
app.post('/api/superadmin/clients',gS,async(req,res)=>{
  try{const id=await createClient(req.body);await setProduits(id,DC);await setExemples(id,DE);res.json({ok:true,id});}
  catch(e){if(e.code==='23505')return res.status(409).json({error:'Slug déjà utilisé'});res.status(500).json({error:e.message});}
});
app.put('/api/superadmin/clients/:id',gS,async(req,res)=>{try{await updateClient(parseInt(req.params.id),req.body);res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});
app.delete('/api/superadmin/clients/:id',gS,async(req,res)=>{try{await deleteClient(parseInt(req.params.id));res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});

app.get('/api/:slug/config',gC,gM,async(req,res)=>{
  try{const c=await getById(req.session.client_id);if(!c)return res.status(404).json({error:'Introuvable'});
    const p=await getProduits(req.session.client_id),e=await getExemples(req.session.client_id);
    res.json({agent_nom:c.agent_nom,nom:c.nom,secteur:c.secteur,color:c.color,dark_color:c.dark_color,instructions:c.instructions,produits:p,exemples:e});}
  catch(e){res.status(500).json({error:e.message});}
});
app.post('/api/:slug/config',gA,gM,async(req,res)=>{
  try{const{produits,exemples,...f}=req.body;await updateClient(req.session.client_id,f);
    if(produits!==undefined)await setProduits(req.session.client_id,produits);
    if(exemples!==undefined)await setExemples(req.session.client_id,exemples);
    res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}
});

app.post('/api/:slug/chat',gC,gM,async(req,res)=>{
  try{const{query}=req.body;if(!query||query.length>2000)return res.status(400).json({error:'Invalide'});
    const c=await getById(req.session.client_id);
    const key=decrypt(c?.api_key_enc||'')||process.env.ANTHROPIC_API_KEY||'';
    if(!key)return res.status(500).json({error:'Clé API manquante'});
    const p=await getProduits(req.session.client_id);
    const cat=p.map(x=>`- ${x.nom} : ${x.description} · ${x.prix} · ${x.disponibilite} [${x.type}]`).join('\n');
    const inst=c.instructions?`\nINSTRUCTIONS:\n${c.instructions}`:'';
    const prompt=`Tu es ${c.agent_nom}, assistant commercial chez ${c.nom} (${c.secteur}).${inst}\nDemande: "${query}"\nRéponds en JSON: {"analyse":"...","script":"...","kit":[{"type":"must|up|warn","emoji":"🔨","nom":"...","pourquoi":"...","prix":"...","stock":"..."}],"oubli":"...","objections":[{"q":"...","r":"..."}],"astuce":"...","panier":"..."}\nCATALOGUE:\n${cat}`;
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1200,messages:[{role:'user',content:prompt}]})});
    const d=await r.json();if(!r.ok)return res.status(500).json({error:d.error?.message||'Erreur API'});
    let parsed;try{parsed=JSON.parse((d.content?.[0]?.text||'{}').replace(/```json|```/g,'').trim());}catch{parsed={analyse:d.content?.[0]?.text};}
    res.json({ok:true,data:parsed});}catch(e){res.status(500).json({error:e.message});}
});

app.get('/',(req,res)=>res.redirect('/superadmin'));
app.get('/superadmin',(req,res)=>{
  const f=path.join(publicDir,'superadmin.html');
  if(fs.existsSync(f))return res.sendFile(f);
  res.send('<h1>Super Admin</h1><p>superadmin.html manquant</p>');
});
app.get('/:slug',async(req,res)=>{
  const{slug}=req.params;
  if(['health','favicon.ico'].includes(slug))return;
  const c=await getBySlug(slug).catch(()=>null);
  if(!c)return res.status(404).send('<h2>Client introuvable</h2>');
  const f=path.join(publicDir,'client.html');
  if(!fs.existsSync(f))return res.send('<h2>client.html manquant</h2>');
  res.send(fs.readFileSync(f,'utf8').replace(/__SLUG__/g,slug).replace(/__NOM__/g,c.nom));
});

app.listen(PORT,async()=>{
  console.log(`Server running on port ${PORT}`);
  try{await initDB();}catch(e){console.error('DB init error:',e.message);}
});

const DC=[
  {nom:'Perceuse Bosch 18V Pro',description:'2 batteries',prix:'189€',disponibilite:'En stock',type:'must'},
  {nom:'Chevilles béton 8mm x50',description:'Mur béton',prix:'7€',disponibilite:'En stock',type:'warn'},
  {nom:'Set forets béton 4-8mm',description:'7 pièces',prix:'19€',disponibilite:'En stock',type:'must'},
  {nom:'Niveau à bulle 60cm',description:'Pose précise',prix:'9€',disponibilite:'En stock',type:'must'},
  {nom:'Peinture Dulux 10L',description:'Lessivable',prix:'49€',disponibilite:'En stock',type:'must'},
];
const DE=[
  {emoji:'🖼️',texte:'Accrocher un cadre lourd'},
  {emoji:'🚿',texte:'Poser un receveur de douche'},
  {emoji:'🪵',texte:'Poser parquet flottant'},
  {emoji:'🎨',texte:'Repeindre salon'},
];
