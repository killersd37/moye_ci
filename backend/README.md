# MOYÉ Backend API 🌍

> **Patrimoine Culturel Ivoirien** — API RESTful complète, scalable et modulaire

[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-black)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://postgresql.org)

---

## 📂 Structure du Projet

```
backend/
├── prisma/
│   ├── schema.prisma       # Schéma DB complet (15+ modèles)
│   └── seed.ts             # Données initiales (Sanwi, Indénié, Baoulé...)
├── src/
│   ├── app.ts              # Application Express + middlewares
│   ├── server.ts           # Point d'entrée serveur
│   ├── config.ts           # Config centralisée (.env)
│   ├── middlewares/
│   │   ├── authenticate.ts  # JWT (authenticate, authorize)
│   │   ├── errorHandler.ts  # Gestion centralisée des erreurs
│   │   ├── notFoundHandler.ts
│   │   └── upload.ts        # Multer (images, audio, mémoire)
│   ├── utils/
│   │   ├── logger.ts        # Winston logger
│   │   └── prisma.ts        # Client Prisma singleton
│   └── modules/
│       ├── auth/            # Inscription, Connexion, JWT
│       ├── users/           # Profils, Leaderboard, Admin
│       ├── ethnies/         # CRUD Ethnies + sous-ressources
│       ├── pont/            # Langues, Traduction, Chat
│       ├── academie/        # Leçons, Quiz, Gamification
│       ├── medias/          # Podcasts, ONG, Artisans
│       └── scanner/         # Scanner IA (image → objet culturel)
├── .env                    # Variables d'environnement
├── Dockerfile              # Multi-stage build
└── package.json
```

---

## 🚀 Démarrage Rapide (Local)

### Prérequis

- Node.js 20+
- PostgreSQL 14+

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

```bash
cp .env.example .env
# Éditer .env avec vos paramètres (DATABASE_URL obligatoire)
```

### 3. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer le schéma à la DB
npm run db:push

# Remplir avec les données initiales
npm run db:seed
```

### 4. Démarrer le serveur

```bash
npm run dev
# → http://localhost:4000
# → http://localhost:4000/health
# → http://localhost:4000/api/v1
```

---

## 🐳 Démarrage avec Docker

```bash
# Depuis la racine du projet
docker compose up -d

# Avec interface Adminer (http://localhost:8080)
docker compose --profile dev up -d

# Appliquer les migrations + seed
docker compose exec backend npx prisma db push
docker compose exec backend npm run db:seed
```

---

## 📋 Endpoints API

### 🔐 Auth (`/api/v1/auth`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/register` | Créer un compte | — |
| POST | `/login` | Se connecter | — |
| GET | `/me` | Mon profil | ✅ |
| PATCH | `/me` | Modifier profil | ✅ |

### 🏛️ Ethnies (`/api/v1/ethnies`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/` | Liste paginée (filtres: search, regionId...) | — |
| GET | `/regions` | Toutes les régions | — |
| GET | `/:slug` | Détail complet (histoire, rites, gastronomie...) | — |
| POST | `/` | Créer ethnie | Admin/Expert |
| PUT | `/:id` | Modifier ethnie | Admin/Expert |
| DELETE | `/:id` | Supprimer ethnie | Admin |
| POST | `/:id/histoires` | Ajouter une histoire | Admin/Expert |
| POST | `/:id/rites` | Ajouter un rite | Admin/Expert |
| POST | `/:id/gastronomies` | Ajouter gastronomie | Admin/Expert |
| POST | `/:id/fetes` | Ajouter fête | Admin/Expert |

### 🗣️ Langues (`/api/v1/langues`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/` | Toutes les langues actives | — |
| GET | `/:code` | Détail langue avec mots | — |
| GET | `/:code/mots` | Mots filtrés (categorie, search) | — |
| POST | `/` | Créer langue | Admin |
| POST | `/:code/mots` | Ajouter un mot | Admin/Expert |

### 🌐 Traduction (`/api/v1/traductions`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/traduire` | Traduire texte (DB + mock IA) | — |
| GET | `/` | Historique traductions | — |
| POST | `/audio` | Endpoint audio (préparé) | ✅ |

### 💬 Chat (`/api/v1/chat`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/canaux` | Liste des canaux | — |
| GET | `/canaux/:slug/messages` | Messages d'un canal | — |
| POST | `/messages` | Envoyer un message | ✅ |
| POST | `/canaux` | Créer un canal | ✅ |

### 🎓 Académie (`/api/v1/academie`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/niveaux` | Niveaux disponibles | — |
| GET | `/niveaux/:id/lecons` | Leçons d'un niveau | — |
| GET | `/lecons/:id` | Leçon avec quiz | — |
| POST | `/quiz/soumettre` | Soumettre quiz → points | ✅ |
| GET | `/ma-progression` | Ma progression + badges | ✅ |
| POST | `/lecons` | Créer leçon | Admin/Expert |
| POST | `/lecons/:id/questions` | Ajouter question+réponses | Admin/Expert |

### 🎙️ Podcasts (`/api/v1/podcasts`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/` | Liste publiée (filtres) | — |
| GET | `/:id` | Détail + compteur vues | — |
| POST | `/` | Upload audio (multipart/form-data) | ✅ |
| PATCH | `/:id/publish` | Publier podcast | Admin |
| DELETE | `/:id` | Supprimer | Propriétaire/Admin |

### 🤝 ONG (`/api/v1/ongs`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/` | Liste ONG (filtres) | — |
| GET | `/:id` | Détail + artisans | — |
| POST | `/` | Créer ONG | ✅ |
| PUT | `/:id` | Modifier ONG | Responsable/Admin |
| PATCH | `/:id/verify` | Vérifier ONG | Admin |
| DELETE | `/:id` | Supprimer | Admin |
| POST | `/:id/artisans` | Ajouter artisan | ✅ |
| GET | `/artisans/tous` | Tous artisans (filtres) | — |

### 🔬 Scanner IA (`/api/v1/scanner`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/analyser-image` | Scanner image → objet culturel | — |
| GET | `/objets-culturels` | Recherche objets (tags, ethnieId) | — |

---

## 🔑 Comptes de Test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@moye.ci` | `Admin2024!` |
| Expert Culturel | `expert@moye.ci` | `Expert2024!` |
| Utilisateur | `user@moye.ci` | `User2024!` |

---

## 🧩 Architecture

```
Request → Rate Limiter → CORS → Helmet
        → JWT Auth (optionnel)
        → Route Handler
        → Controller (valide avec Zod)
        → Service (logique métier)
        → Prisma (ORM)
        → PostgreSQL
        → Response JSON structuré
        → ErrorHandler (erreurs AppError, Zod, Prisma)
```

---

## 🔮 Prêt pour l'évolution

| Fonctionnalité | État | Comment intégrer |
|---|---|---|
| WebSockets Chat | 🟡 Préparé | Ajouter `socket.io` sur `server.ts` |
| Vision IA (Scanner) | 🟡 Mock local | Remplacer mock par Google Vision API |
| TTS/STT | 🟡 Endpoint prêt | Intégrer Whisper ou Google TTS |
| Cache Redis | 🟡 À ajouter | Ajouter pour les ethnies populaires |
| 60+ Ethnies | 🟡 Étenssible | Ajouter via seed ou API admin |
| OpenAI/Gemini | 🟡 Config prête | `GEMINI_API_KEY` dans .env |

---

## 📊 Modèles Prisma

```
User ─── UserBadge ─── Badge
  │
  ├── Message ─── CanalDiscussion
  ├── Podcast
  ├── ONG ─── Artisan
  └── ProgressionUtilisateur ─── Niveau ─── Lecon ─── Question ─── Reponse

Ethnie ─── Region
  ├── Histoire
  ├── Rite
  ├── ObjetCulturel
  ├── Gastronomie
  └── Fete

Langue ─── Mot
  ├── Traduction (source)
  └── Traduction (cible)
```

---

*MOYÉ API — Patrimoine culturel ivoirien, propulsé par la technologie* 🇨🇮
