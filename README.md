# Assistant Commercial IA — SaaS Multi-clients

## Architecture
- **Serveur** : Node.js + Express
- **Base de données** : PostgreSQL (Scaleway Paris 🇫🇷 — RGPD)
- **IA** : Claude Sonnet via API Anthropic
- **Hébergement** : Railway.app (ou Scaleway App Engine)

---

## DÉPLOIEMENT EN 30 MINUTES

### ÉTAPE 1 — Base de données PostgreSQL chez Scaleway (10 min)

1. Créer un compte sur **scaleway.com**
2. Console → **Managed Databases** → **Create Database**
   - Engine : **PostgreSQL 15**
   - Région : **Paris (fr-par)**
   - Node type : DB-DEV-S (le moins cher, ~7€/mois)
3. Une fois créé, copier la **connection string** (format : `postgresql://user:pass@host:5432/db`)
4. Dans **Allowed IPs**, ajouter `0.0.0.0/0` pour autoriser Railway

### ÉTAPE 2 — Déploiement serveur sur Railway (10 min)

1. Créer un compte sur **github.com**
2. Créer un repository : "assistant-commercial-saas"
3. Uploader tous les fichiers de ce dossier
4. Créer un compte sur **railway.app**
5. New Project → Deploy from GitHub → Sélectionner votre repo

### ÉTAPE 3 — Variables d'environnement sur Railway (5 min)

Dans Railway → Variables → ajouter :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | Votre connection string Scaleway |
| `SESSION_SECRET` | Une chaîne aléatoire (ex: générez sur random.org) |
| `SUPER_ADMIN_PASSWORD` | Votre mot de passe super admin |
| `ANTHROPIC_API_KEY` | Votre clé API Anthropic (optionnel si définie par client) |
| `NODE_ENV` | production |

### ÉTAPE 4 — Initialiser la base de données (2 min)

Dans Railway → votre service → **Shell** :
```bash
node setup-db.js
```

### ÉTAPE 5 — Domaine (3 min)

Railway → Settings → Networking → **Generate Domain**
→ Vous obtenez : `assistant-commercial-xxxxx.up.railway.app`

Pour un domaine personnalisé (ex: `app.monservice.fr`) :
- Railway → Custom Domain → Entrer votre domaine
- Chez votre registrar (OVH) → DNS → Ajouter CNAME pointant vers Railway

---

## UTILISATION

### Accès super admin
→ `votre-url.com/superadmin`
→ Mot de passe : celui défini dans `SUPER_ADMIN_PASSWORD`

### Créer un nouveau client
1. Super admin → **+ Nouveau client**
2. Remplir : slug (ex: `bricoexpert`), nom, secteur, agent, couleurs
3. Définir les mots de passe admin et commerciaux
4. Créer → Le catalogue par défaut est automatiquement ajouté

### Accès client
→ `votre-url.com/bricoexpert`
→ Interface commerciaux : mot de passe défini à la création (défaut: `vendeur123`)
→ Interface admin : mot de passe défini à la création (défaut: `admin123`)

### Ajouter un domaine client (option premium)
→ Railway → Custom Domain → `rachid.bricoexpert.fr`
→ DNS chez OVH : CNAME `rachid` → Railway domain

---

## MOTS DE PASSE PAR DÉFAUT

| Qui | Mot de passe par défaut |
|---|---|
| Super Admin (vous) | Défini dans `SUPER_ADMIN_PASSWORD` |
| Admin client | `admin123` |
| Commerciaux | `vendeur123` |

⚠️ **Changez TOUS les mots de passe dès le premier déploiement.**

---

## STRUCTURE DES FICHIERS

```
saas-commercial/
├── server.js          ← Serveur Express (routes, auth, proxy API)
├── setup-db.js        ← Initialisation base de données
├── schema.sql         ← Schéma PostgreSQL
├── package.json       ← Dépendances Node.js
├── .env.example       ← Modèle variables d'environnement
├── src/
│   └── db.js          ← Module base de données (queries, chiffrement)
└── public/
    ├── superadmin.html ← Interface super admin (vous)
    └── client.html     ← Interface client (admin + commerciaux)
```

---

## SÉCURITÉ

- ✅ Clés API chiffrées en AES-256 dans la base
- ✅ Mots de passe hashés en SHA-256 avec salt
- ✅ Sessions httpOnly + secure (HTTPS)
- ✅ Isolation totale entre clients (slug + session check)
- ✅ API Anthropic jamais exposée côté client
- ✅ Serveurs PostgreSQL en France (RGPD)

---

## TARIFICATION SUGGÉRÉE

| Service | Prix |
|---|---|
| Installation + configuration | 990€ une fois |
| Abonnement mensuel | 99€/mois |
| Infrastructure (à votre charge) | ~15€/mois/client |
| Bénéfice net à 10 clients | ~840€/mois récurrent |
