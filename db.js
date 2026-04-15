<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__NOM__ · Assistant Commercial IA</title>
<script>window.__SLUG__ = '__SLUG__';</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--p:#E8761A;--dark:#1a1a1a;--bg:#f2f2f2;--white:#fff;--border:#e8e8e8;--muted:#888;--success:#22c55e;--danger:#dc2626;--up-bg:#fff8f3;--up-bdr:#fdd9b5;--warn-bg:#fff5f5;--warn-bdr:#fecaca;--r:10px}
html,body{height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--dark);font-size:14px}
.hidden{display:none!important}
.screen{display:none;height:100vh;flex-direction:column;overflow:hidden}
.screen.active{display:flex}
input,textarea,select{width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;color:var(--dark);background:#fafafa;outline:none;transition:border-color .15s}
input:focus,textarea:focus,select:focus{border-color:var(--p);background:var(--white)}
textarea{resize:vertical;line-height:1.55}
label{font-size:11px;font-weight:700;color:var(--muted);margin-bottom:4px;display:block;text-transform:uppercase;letter-spacing:.05em}
.btn{padding:9px 18px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:opacity .15s}
.btn:hover{opacity:.85} .btn:disabled{opacity:.45;cursor:default}
.btn-p{background:var(--p);color:#fff}
.btn-dk{background:var(--dark);color:#fff}
.btn-ol{background:transparent;border:1.5px solid var(--border);color:var(--dark)}
.btn-dn{background:var(--danger);color:#fff}
.btn-sm{padding:5px 12px;font-size:12px}
.card{background:var(--white);border-radius:var(--r);border:1px solid var(--border);padding:16px}
.fr{display:flex;flex-direction:column;gap:5px;margin-bottom:12px}

/* Login */
#screen-login{align-items:center;justify-content:center;background:var(--dark)}
.login-box{background:var(--white);border-radius:16px;padding:36px 32px;width:380px;max-width:calc(100vw - 32px)}
.login-head{text-align:center;margin-bottom:20px}
.login-title{font-size:22px;font-weight:800;color:var(--dark)}
.login-title span{color:var(--p)}
.login-sub{font-size:12px;color:var(--muted);margin-top:4px}
.ltabs{display:flex;gap:5px;margin-bottom:16px;background:#f5f5f5;border-radius:8px;padding:4px}
.ltab{flex:1;padding:8px;border-radius:6px;border:none;background:transparent;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;font-family:inherit;transition:all .15s}
.ltab.active{background:var(--white);color:var(--dark);box-shadow:0 1px 4px rgba(0,0,0,.1)}
.login-err{background:var(--warn-bg);color:var(--danger);border-radius:7px;padding:8px 12px;font-size:12px;font-weight:600;margin-bottom:10px}

/* Appbar */
.appbar{background:var(--dark);padding:0 20px;display:flex;align-items:center;height:54px;gap:10px;flex-shrink:0}
.appbar-logo{font-size:16px;font-weight:800;color:#fff}
.appbar-logo span{color:var(--p)}
.appbar-sep{width:1px;height:22px;background:rgba(255,255,255,.12)}
.appbar-nav{display:flex;gap:2px;flex:1}
.ntab{padding:7px 13px;border-radius:7px;border:none;background:transparent;color:rgba(255,255,255,.5);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.ntab.active,.ntab:hover{background:rgba(255,255,255,.1);color:#fff}
.appbar-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.apill{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:5px 12px}
.adot{width:6px;height:6px;border-radius:50%;background:var(--success)}
.apill-lbl{font-size:11px;font-weight:600;color:rgba(255,255,255,.8)}
.btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);padding:5px 13px;border-radius:7px;font-size:12px;cursor:pointer;font-family:inherit;font-weight:600}

/* Admin */
#screen-admin{background:var(--bg)}
.admin-body{flex:1;overflow-y:auto;padding:20px 20px 40px}
.admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.sec-title{font-size:13px;font-weight:700;color:var(--dark);margin-bottom:12px;display:flex;align-items:center;gap:6px}
.sec-title::before{content:'';width:3px;height:16px;background:var(--p);border-radius:2px;display:block}
.color-row{display:flex;align-items:center;gap:10px}
.cswatch{width:36px;height:36px;border-radius:7px;border:1.5px solid var(--border);cursor:pointer;padding:2px;flex-shrink:0}
.cat-tbl{width:100%;border-collapse:collapse}
.cat-tbl th{text-align:left;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;padding:6px 8px;border-bottom:2px solid var(--border)}
.cat-tbl td{padding:6px 8px;border-bottom:1px solid var(--border);vertical-align:middle}
.cat-tbl tr:last-child td{border-bottom:none}
.cat-tbl input,.cat-tbl select{font-size:12px;padding:5px 8px}
.add-row{display:grid;grid-template-columns:1fr 2fr 80px 110px 90px auto;gap:6px;align-items:end;padding:10px 0 4px;border-top:1px solid var(--border);margin-top:4px}
.save-bar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--dark);color:#fff;padding:10px 20px;border-radius:20px;font-size:13px;font-weight:600;z-index:100;opacity:0;transition:opacity .3s;pointer-events:none}
.save-bar.show{opacity:1}

/* Commercial */
#screen-commercial{background:var(--bg)}
.com-body{flex:1;overflow-y:auto;padding:20px 20px 40px;max-width:720px;width:100%;margin:0 auto}
.s-card{background:var(--white);border-radius:14px;padding:16px;border:2px solid var(--p);box-shadow:0 2px 14px rgba(232,118,26,.1);margin-bottom:16px}
.s-lbl{font-size:11px;font-weight:700;color:var(--p);text-transform:uppercase;letter-spacing:.07em;margin-bottom:9px;display:flex;align-items:center;gap:5px}
.s-lbl::before{content:'';width:6px;height:6px;background:var(--p);border-radius:50%;display:block}
.s-row{display:flex;gap:8px}
.go-btn{background:var(--p);border:none;border-radius:9px;width:82px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0}
.go-btn:disabled{background:#ccc;cursor:default}
.go-btn svg{width:20px;height:20px;fill:#fff}
.ex-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:7px;margin-top:10px}
.ex-chip{background:var(--up-bg);border:1px solid var(--up-bdr);border-radius:8px;padding:9px 12px;font-size:12px;color:#c05e10;cursor:pointer;font-weight:500;display:flex;align-items:center;gap:6px;transition:background .15s}
.ex-chip:hover{background:var(--up-bdr)}
.results{display:flex;flex-direction:column;gap:10px}
.r-dark{background:var(--dark);border-radius:12px;padding:15px 16px}
.r-head{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.r-av{width:38px;height:38px;border-radius:50%;background:var(--p);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0}
.r-name{font-size:13px;font-weight:700;color:#fff}
.r-role{font-size:10px;color:rgba(255,255,255,.45)}
.r-q{font-size:11px;color:rgba(255,255,255,.35);font-style:italic;border-top:1px solid rgba(255,255,255,.08);padding-top:7px;margin-bottom:7px}
.r-txt{font-size:13px;color:rgba(255,255,255,.88);line-height:1.6}
.r-clbl{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;display:flex;align-items:center;gap:5px}
.r-clbl::before{content:'';width:3px;height:13px;background:var(--p);border-radius:2px;display:block}
.script-box{font-size:13px;color:var(--dark);line-height:1.65;background:var(--up-bg);border-radius:8px;padding:12px 14px;border-left:3px solid var(--p);font-style:italic}
.kit-list{display:flex;flex-direction:column;gap:7px}
.kit-sep{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-top:4px;display:flex;align-items:center;gap:8px}
.kit-sep::after{content:'';flex:1;height:1px;background:var(--border)}
.ki{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:9px;border:1.5px solid var(--border);background:#fafafa}
.ki.up{background:var(--up-bg);border-color:var(--up-bdr)}
.ki.warn{background:var(--warn-bg);border-color:var(--warn-bdr)}
.ki-icon{font-size:22px;width:44px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#f0f0f0;flex-shrink:0}
.ki.up .ki-icon{background:#feecd4} .ki.warn .ki-icon{background:#fee2e2}
.ki-body{flex:1;min-width:0}
.ki-badge{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;display:flex;align-items:center;gap:4px}
.ki-badge::before{content:'';width:5px;height:5px;border-radius:50%;display:block}
.ki-badge.must{color:var(--dark)} .ki-badge.must::before{background:var(--dark)}
.ki-badge.up{color:var(--p)} .ki-badge.up::before{background:var(--p)}
.ki-badge.warn{color:var(--danger)} .ki-badge.warn::before{background:var(--danger)}
.ki-name{font-size:13px;font-weight:700} .ki-why{font-size:11px;color:var(--muted);margin-top:1px;line-height:1.4}
.ki-right{text-align:right;flex-shrink:0}
.ki-price{font-size:15px;font-weight:800}
.ki-stock{font-size:10px;color:var(--success);font-weight:600;margin-top:2px}
.ki-wlbl{font-size:10px;color:var(--danger);font-weight:600;margin-top:2px}
.obj-list{display:flex;flex-direction:column;gap:6px}
.obj{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:11px}
.obj-q{font-size:12px;color:var(--muted);margin-bottom:4px}
.obj-a{font-size:13px;line-height:1.5}
.tip{display:flex;gap:9px;align-items:flex-start;border-radius:10px;padding:12px 13px;border:1.5px solid}
.tip.or{background:var(--up-bg);border-color:var(--up-bdr)}
.tip.rd{background:var(--warn-bg);border-color:var(--warn-bdr)}
.tip svg{width:15px;height:15px;flex-shrink:0;margin-top:2px}
.tip.or svg{fill:var(--p)} .tip.rd svg{fill:var(--danger)}
.tip-t{font-size:13px;line-height:1.55}
.tip.or .tip-t{color:#5a3a10} .tip.rd .tip-t{color:#7f1d1d}
.tip-t strong{color:var(--p)} .tip.rd .tip-t strong{color:var(--danger)}
.panier{background:var(--dark);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.p-lbl{font-size:11px;color:rgba(255,255,255,.5);margin-bottom:2px}
.p-tot{font-size:26px;font-weight:800;color:#fff}
.p-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:2px}
.reset-btn{width:100%;background:transparent;border:1.5px dashed #ccc;border-radius:9px;padding:12px;text-align:center;font-size:13px;color:var(--muted);cursor:pointer;transition:all .15s}
.reset-btn:hover{border-color:var(--p);color:var(--p)}
.loading{text-align:center;padding:28px;background:var(--white);border-radius:12px;border:1px solid var(--border)}
.loading p{font-size:14px;color:var(--muted);margin-bottom:10px}
.ldots{display:flex;justify-content:center;gap:5px}
.ldot{width:8px;height:8px;border-radius:50%;background:var(--p);opacity:.4;animation:ld 1.2s infinite}
.ldot:nth-child(2){animation-delay:.2s} .ldot:nth-child(3){animation-delay:.4s}
@keyframes ld{0%,60%,100%{opacity:.4;transform:scale(1)}30%{opacity:1;transform:scale(1.3)}}
@media(max-width:600px){.admin-grid{grid-template-columns:1fr}.add-row{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="screen-login" class="screen">
  <div class="login-box">
    <div class="login-head">
      <div class="login-title" id="login-title">Assistant<span>IA</span></div>
      <div class="login-sub">Connectez-vous pour continuer</div>
    </div>
    <div class="ltabs">
      <button class="ltab active" id="ltab-c" onclick="setTab('commercial')">Commerciaux</button>
      <button class="ltab" id="ltab-a" onclick="setTab('admin')">Administration</button>
    </div>
    <div class="fr"><label>Mot de passe</label><input type="password" id="pw" placeholder="••••••••" onkeydown="if(event.key==='Enter')doLogin()"></div>
    <div id="login-err" class="login-err hidden">Mot de passe incorrect</div>
    <button class="btn btn-dk" style="width:100%" onclick="doLogin()">Se connecter</button>
  </div>
</div>

<!-- ADMIN -->
<div id="screen-admin" class="screen">
  <div class="appbar">
    <div class="appbar-logo" id="adm-logo">AssistantIA</div>
    <div class="appbar-sep"></div>
    <div class="appbar-nav">
      <button class="ntab active" onclick="aTab('general',this)">Général</button>
      <button class="ntab" onclick="aTab('catalogue',this)">Catalogue</button>
      <button class="ntab" onclick="aTab('exemples',this)">Exemples</button>
      <button class="ntab" onclick="aTab('securite',this)">Sécurité</button>
    </div>
    <div class="appbar-right">
      <button class="btn btn-p btn-sm" onclick="saveAll()">Enregistrer</button>
      <button class="btn-ghost" onclick="goComm()">→ Commerciaux</button>
      <button class="btn-ghost" onclick="doLogout()">Déconnexion</button>
    </div>
  </div>
  <div class="admin-body">
    <div id="tab-general">
      <div class="admin-grid">
        <div class="card">
          <div class="sec-title">Identité de l'agent</div>
          <div class="fr"><label>Nom de l'agent</label><input id="a-nom" /></div>
          <div class="fr"><label>Entreprise</label><input id="a-ent" /></div>
          <div class="fr"><label>Secteur</label><input id="a-sec" /></div>
          <div class="fr"><label>Clé API Anthropic</label><input id="a-key" type="password" placeholder="Laisser vide pour ne pas modifier" autocomplete="off" /></div>
        </div>
        <div class="card">
          <div class="sec-title">Charte graphique</div>
          <div class="fr"><label>Couleur principale</label>
            <div class="color-row">
              <input type="color" id="cs1" class="cswatch" oninput="document.getElementById('ch1').value=this.value;applyColors()">
              <input id="ch1" oninput="syncColor('cs1','ch1')">
            </div>
          </div>
          <div class="fr"><label>Couleur header</label>
            <div class="color-row">
              <input type="color" id="cs2" class="cswatch" oninput="document.getElementById('ch2').value=this.value;applyColors()">
              <input id="ch2" oninput="syncColor('cs2','ch2')">
            </div>
          </div>
          <div class="fr"><label>Instructions agent</label><textarea id="a-inst" rows="5"></textarea></div>
        </div>
      </div>
    </div>
    <div id="tab-catalogue" class="hidden">
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div class="sec-title" style="margin:0">Catalogue produits</div>
          <button class="btn btn-ol btn-sm" onclick="importTxt()">Importer texte</button>
        </div>
        <table class="cat-tbl">
          <thead><tr>
            <th style="width:22%">Nom</th><th style="width:33%">Description</th>
            <th style="width:9%">Prix</th><th style="width:13%">Dispo</th>
            <th style="width:14%">Type</th><th></th>
          </tr></thead>
          <tbody id="cat-body"></tbody>
        </table>
        <div class="add-row">
          <input id="np-n" placeholder="Nom" /><input id="np-d" placeholder="Description" />
          <input id="np-p" placeholder="Prix" />
          <select id="np-dsp"><option>En stock</option><option>Sur commande</option><option>Rupture</option></select>
          <select id="np-t"><option value="must">Indispensable</option><option value="up">Conseillé</option><option value="warn">À ne pas oublier</option></select>
          <button class="btn btn-p btn-sm" onclick="addProd()">+ Ajouter</button>
        </div>
      </div>
    </div>
    <div id="tab-exemples" class="hidden">
      <div class="card">
        <div class="sec-title">Boutons raccourcis</div>
        <div id="ex-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px"></div>
        <div style="display:flex;gap:8px;align-items:flex-end">
          <div class="fr" style="margin:0;width:58px"><label>Emoji</label><input id="ne-e" style="text-align:center"></div>
          <div class="fr" style="margin:0;flex:1"><label>Texte</label><input id="ne-t" placeholder="Ex: Accrocher un cadre"></div>
          <button class="btn btn-p btn-sm" style="margin-bottom:1px" onclick="addEx()">+ Ajouter</button>
        </div>
      </div>
    </div>
    <div id="tab-securite" class="hidden">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:700px">
        <div class="card">
          <div class="sec-title">Mot de passe commerciaux</div>
          <div class="fr"><label>Nouveau</label><input type="password" id="pw-c1"></div>
          <div class="fr"><label>Confirmer</label><input type="password" id="pw-c2"></div>
          <div id="pw-cmsg" style="font-size:12px;margin-bottom:8px"></div>
          <button class="btn btn-p" onclick="changePw('commercial')">Mettre à jour</button>
        </div>
        <div class="card">
          <div class="sec-title">Mot de passe admin</div>
          <div class="fr"><label>Nouveau</label><input type="password" id="pw-a1"></div>
          <div class="fr"><label>Confirmer</label><input type="password" id="pw-a2"></div>
          <div id="pw-amsg" style="font-size:12px;margin-bottom:8px"></div>
          <button class="btn btn-dk" onclick="changePw('admin')">Mettre à jour</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- COMMERCIAL -->
<div id="screen-commercial" class="screen">
  <div class="appbar">
    <div class="appbar-logo" id="com-logo">AssistantIA</div>
    <div class="appbar-sep"></div>
    <div style="flex:1"></div>
    <div class="appbar-right">
      <div class="apill"><div class="adot"></div><div class="apill-lbl" id="com-pill">Agent · En ligne</div></div>
      <button class="btn-ghost" onclick="setScreen('screen-login')">Déconnexion</button>
    </div>
  </div>
  <div class="com-body">
    <div class="s-card">
      <div class="s-lbl">Demande du client</div>
      <div class="s-row">
        <textarea id="q-inp" rows="2" placeholder="Ex : Client veut accrocher une étagère lourde sur béton…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();launch()}"></textarea>
        <button class="go-btn" id="go-btn" onclick="launch()">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          Kit
        </button>
      </div>
      <div class="ex-grid" id="ex-grid"></div>
    </div>
    <div class="results" id="results"></div>
  </div>
</div>

<div class="save-bar" id="save-bar">✓ Enregistré</div>

<script>
const SLUG = window.__SLUG__;
let CFG = {}, loginRole = 'commercial';

async function api(url, method='GET', body=null) {
  const opts={method,headers:{'Content-Type':'application/json'},credentials:'same-origin'};
  if(body) opts.body=JSON.stringify(body);
  const r=await fetch(url,opts);
  return r.json();
}

window.addEventListener('load', async ()=>{
  const me = await api('/api/auth/me');
  if((me.role==='admin'||me.role==='commercial') && me.slug===SLUG){
    await loadConfig();
    me.role==='admin' ? showAdmin() : showCommercial();
  } else {
    setScreen('screen-login');
  }
});

function setTab(role){
  loginRole=role;
  document.getElementById('ltab-c').classList.toggle('active',role==='commercial');
  document.getElementById('ltab-a').classList.toggle('active',role==='admin');
  document.getElementById('login-err').classList.add('hidden');
  document.getElementById('pw').value='';
}

async function doLogin(){
  const pw=document.getElementById('pw').value;
  const err=document.getElementById('login-err');
  err.classList.add('hidden');
  const r=await api(`/api/auth/${SLUG}/login`,'POST',{password:pw,role:loginRole});
  if(r.ok){ await loadConfig(); loginRole==='admin'?showAdmin():showCommercial(); }
  else err.classList.remove('hidden');
}

async function doLogout(){
  await api('/api/auth/logout','POST');
  CFG={};
  setScreen('screen-login');
}

function setScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function showAdmin(){ loadAdminFields(); setScreen('screen-admin'); }
function showCommercial(){ buildExGrid(); setScreen('screen-commercial'); }
function goComm(){ showCommercial(); }

async function loadConfig(){
  CFG=await api(`/api/${SLUG}/config`);
  applyColors();
  updateBranding();
}

function applyColors(){
  if(CFG.color) document.documentElement.style.setProperty('--p',CFG.color);
  if(CFG.dark_color) document.documentElement.style.setProperty('--dark',CFG.dark_color);
}
function updateBranding(){
  const n=CFG.nom||'AssistantIA';
  const h=Math.ceil(n.length/2);
  const html=n.slice(0,h)+'<span>'+n.slice(h)+'</span>';
  ['adm-logo','com-logo','login-title'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=html;});
  const pill=document.getElementById('com-pill');
  if(pill) pill.textContent=(CFG.agent_nom||'Agent')+' · En ligne';
  document.title=n+' · Assistant Commercial';
}

function loadAdminFields(){
  document.getElementById('a-nom').value  = CFG.agent_nom||'';
  document.getElementById('a-ent').value  = CFG.nom||'';
  document.getElementById('a-sec').value  = CFG.secteur||'';
  document.getElementById('a-key').value  = '';
  document.getElementById('a-inst').value = CFG.instructions||'';
  document.getElementById('ch1').value    = CFG.color||'#E8761A';
  document.getElementById('cs1').value    = CFG.color||'#E8761A';
  document.getElementById('ch2').value    = CFG.dark_color||'#1a1a1a';
  document.getElementById('cs2').value    = CFG.dark_color||'#1a1a1a';
  renderCatTable();
  renderExList();
}

function syncColor(sw,hx){
  const v=document.getElementById(hx).value;
  if(/^#[0-9A-Fa-f]{6}$/.test(v)){document.getElementById(sw).value=v;applyColors();}
}

async function saveAll(){
  const produits=readCatTable();
  const exemples=CFG.exemples||[];
  const payload={
    agent_nom:    document.getElementById('a-nom').value.trim(),
    nom:          document.getElementById('a-ent').value.trim(),
    secteur:      document.getElementById('a-sec').value.trim(),
    color:        document.getElementById('ch1').value,
    dark_color:   document.getElementById('ch2').value,
    instructions: document.getElementById('a-inst').value.trim(),
    api_key:      document.getElementById('a-key').value.trim()||undefined,
    produits, exemples,
  };
  const r=await api(`/api/${SLUG}/config`,'POST',payload);
  if(r.ok){ await loadConfig(); showBanner(); }
  else alert(r.error||'Erreur');
}

function renderCatTable(){
  const tbody=document.getElementById('cat-body');
  tbody.innerHTML='';
  (CFG.produits||[]).forEach((p,i)=>{
    tbody.innerHTML+=`<tr>
      <td><input value="${esc(p.nom)}" /></td>
      <td><input value="${esc(p.description||p.desc||'')}" /></td>
      <td><input value="${esc(p.prix)}" /></td>
      <td><select>${['En stock','Sur commande','Rupture'].map(o=>`<option${o===p.disponibilite?' selected':''}>${o}</option>`).join('')}</select></td>
      <td><select>${[['must','Indispensable'],['up','Conseillé'],['warn','À ne pas oublier']].map(([v,l])=>`<option value="${v}"${v===p.type?' selected':''}>${l}</option>`).join('')}</select></td>
      <td><button class="btn btn-dn btn-sm" onclick="this.closest('tr').remove()">✕</button></td>
    </tr>`;
  });
}
function readCatTable(){
  const out=[];
  document.querySelectorAll('#cat-body tr').forEach(r=>{
    const i=r.querySelectorAll('input,select');
    if(i.length>=5&&i[0].value.trim()) out.push({nom:i[0].value.trim(),description:i[1].value.trim(),prix:i[2].value.trim(),disponibilite:i[3].value,type:i[4].value});
  });
  return out;
}
function addProd(){
  const nom=document.getElementById('np-n').value.trim();
  if(!nom)return;
  if(!CFG.produits)CFG.produits=[];
  CFG.produits.push({nom,description:document.getElementById('np-d').value.trim(),prix:document.getElementById('np-p').value.trim(),disponibilite:document.getElementById('np-dsp').value,type:document.getElementById('np-t').value});
  ['np-n','np-d','np-p'].forEach(id=>document.getElementById(id).value='');
  renderCatTable();
}
function importTxt(){
  const txt=prompt('Collez votre catalogue (1 ligne = Nom · Description · Prix)');
  if(!txt)return;
  if(!CFG.produits)CFG.produits=[];
  txt.split('\n').forEach(l=>{const p=l.split('·').map(s=>s.trim());if(p[0])CFG.produits.push({nom:p[0],description:p[1]||'',prix:p[2]||'',disponibilite:'En stock',type:'must'});});
  renderCatTable();
}

function renderExList(){
  const list=document.getElementById('ex-list');
  list.innerHTML='';
  (CFG.exemples||[]).forEach((e,i)=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;gap:8px;align-items:center';
    row.innerHTML=`<input value="${esc(e.emoji||'')}" style="width:52px;text-align:center" oninput="CFG.exemples[${i}].emoji=this.value"><input value="${esc(e.texte)}" style="flex:1" oninput="CFG.exemples[${i}].texte=this.value"><button class="btn btn-dn btn-sm" onclick="CFG.exemples.splice(${i},1);renderExList()">✕</button>`;
    list.appendChild(row);
  });
}
function addEx(){
  const emoji=document.getElementById('ne-e').value.trim()||'🔧';
  const texte=document.getElementById('ne-t').value.trim();
  if(!texte)return;
  if(!CFG.exemples)CFG.exemples=[];
  CFG.exemples.push({emoji,texte});
  document.getElementById('ne-e').value=''; document.getElementById('ne-t').value='';
  renderExList();
}

async function changePw(role){
  const p1=document.getElementById(`pw-${role[0]}1`).value;
  const p2=document.getElementById(`pw-${role[0]}2`).value;
  const msg=document.getElementById(`pw-${role[0]}msg`);
  if(!p1){msg.textContent='Entrez un mot de passe.';msg.style.color='var(--danger)';return;}
  if(p1!==p2){msg.textContent='Les mots de passe ne correspondent pas.';msg.style.color='var(--danger)';return;}
  const payload=role==='admin'?{pw_admin:p1}:{pw_commercial:p1};
  const r=await api(`/api/${SLUG}/config`,'POST',payload);
  if(r.ok){msg.textContent='✓ Mis à jour.';msg.style.color='var(--success)';document.getElementById(`pw-${role[0]}1`).value='';document.getElementById(`pw-${role[0]}2`).value='';}
}

function aTab(name,el){
  ['general','catalogue','exemples','securite'].forEach(t=>document.getElementById('tab-'+t).classList.add('hidden'));
  document.getElementById('tab-'+name).classList.remove('hidden');
  document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

function buildExGrid(){
  const grid=document.getElementById('ex-grid');
  if(!grid)return;
  grid.innerHTML='';
  (CFG.exemples||[]).forEach(e=>{
    const d=document.createElement('div');
    d.className='ex-chip';
    d.innerHTML=`<span style="font-size:15px">${e.emoji||'🔧'}</span>${esc(e.texte)}`;
    d.onclick=()=>{document.getElementById('q-inp').value=e.texte;};
    grid.appendChild(d);
  });
}

async function launch(){
  const q=document.getElementById('q-inp').value.trim();
  if(!q)return;
  document.getElementById('go-btn').disabled=true;
  const res=document.getElementById('results');
  res.innerHTML=`<div class="loading"><p>${esc(CFG.agent_nom||'L\'agent')} prépare le kit…</p><div class="ldots"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>`;
  const r=await api(`/api/${SLUG}/chat`,'POST',{query:q}).catch(()=>({error:'Erreur réseau.'}));
  document.getElementById('go-btn').disabled=false;
  if(r.error){res.innerHTML=`<div class="loading"><p>⚠️ ${esc(r.error)}</p></div>`;return;}
  render(q,r.data||{});
}

function render(q,d){
  const initial=(CFG.agent_nom||'A')[0].toUpperCase();
  let html='';
  html+=`<div class="r-dark"><div class="r-head"><div class="r-av">${initial}</div><div><div class="r-name">${esc(CFG.agent_nom)} · Kit projet complet</div><div class="r-role">Zéro oubli · Zéro retour client</div></div></div><div class="r-q">"${esc(q)}"</div><div class="r-txt">${esc(d.analyse||'')}</div></div>`;
  if(d.script) html+=`<div class="card"><div class="r-clbl">Ce que vous dites au client</div><div class="script-box">${esc(d.script)}</div></div>`;
  if(d.kit?.length){
    const mu=d.kit.filter(i=>i.type==='must'),up=d.kit.filter(i=>i.type==='up'),wa=d.kit.filter(i=>i.type==='warn');
    html+=`<div class="card"><div class="r-clbl">Kit complet — tout ce qu'il faut</div><div class="kit-list">`;
    if(mu.length){html+=`<div class="kit-sep">Indispensables</div>`;mu.forEach(p=>html+=ki(p,'must','Indispensable'));}
    if(up.length){html+=`<div class="kit-sep">Fortement conseillés</div>`;up.forEach(p=>html+=ki(p,'up','Conseillé'));}
    if(wa.length){html+=`<div class="kit-sep">Ne pas oublier</div>`;wa.forEach(p=>html+=ki(p,'warn','Attention'));}
    html+=`</div></div>`;
  }
  if(d.oubli) html+=`<div class="tip rd"><svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg><div class="tip-t"><strong>Oubli classique :</strong> ${esc(d.oubli)}</div></div>`;
  if(d.objections?.length){html+=`<div class="card"><div class="r-clbl">Objections &amp; réponses</div><div class="obj-list">`;d.objections.forEach(o=>html+=`<div class="obj"><div class="obj-q">❓ ${esc(o.q)}</div><div class="obj-a">✅ ${esc(o.r)}</div></div>`);html+=`</div></div>`;}
  if(d.astuce) html+=`<div class="tip or"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg><div class="tip-t"><strong>Astuce pro :</strong> ${esc(d.astuce)}</div></div>`;
  if(d.panier) html+=`<div class="panier"><div><div class="p-lbl">Panier estimé</div><div class="p-tot">${esc(d.panier)}</div><div class="p-sub">kit complet · rien à oublier</div></div></div>`;
  html+=`<button class="reset-btn" onclick="document.getElementById('q-inp').value='';document.getElementById('results').innerHTML='';document.getElementById('q-inp').focus()">+ Nouvelle demande client</button>`;
  document.getElementById('results').innerHTML=html;
  document.querySelector('.com-body').scrollTo({top:0,behavior:'smooth'});
}

function ki(p,cls,lbl){return `<div class="ki ${cls}"><div class="ki-icon">${p.emoji||'🔧'}</div><div class="ki-body"><div class="ki-badge ${cls}">${lbl}</div><div class="ki-name">${esc(p.nom)}</div><div class="ki-why">${esc(p.pourquoi)}</div></div><div class="ki-right"><div class="ki-price">${esc(p.prix)}</div><div class="${cls==='warn'?'ki-wlbl':'ki-stock'}">● ${esc(p.stock||'')}</div></div></div>`;}
function showBanner(){const b=document.getElementById('save-bar');b.classList.add('show');setTimeout(()=>b.classList.remove('show'),2200);}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
</script>
</body>
</html>
