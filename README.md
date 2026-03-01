# MOYÉ — La Lumière

Plateforme de préservation du patrimoine culturel ivoirien (ethnies, langues, traditions, sites touristiques) avec assistant IA **La Lumière Moyé**.

---

## Prérequis

- **Node.js** 18+ et npm
- **PostgreSQL** 16 (local ou Docker) — pour le contexte culturel (RAG)
- **Ollama** (optionnel) — pour les réponses de l’assistant IA en local (`ollama run llama3:8b`)

---

## Structure du projet

```
moyé/
├── backend/          # API Node + Express + Prisma (port 4000)
│   ├── prisma/
│   └── src/
├── src/              # Frontend React + Vite (port 3000)
├── server.ts         # Serveur de dev frontend (Vite + HTTPS)
├── package.json      # Frontend
└── README.md
```

---

## Installation

### 1. Dépendances (racine + backend)

```bash
# À la racine du projet (frontend)
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Variables d’environnement

**Backend** — copier l’exemple et adapter si besoin :

```bash
cd backend
cp .env.example .env
```

Vérifier dans `.env` au minimum :

- `DATABASE_URL` : connexion PostgreSQL (voir section Base de données ci‑dessous)

---

## Base de données (PostgreSQL)

Le backend a besoin de PostgreSQL pour le contexte culturel (ethnies, langues, académie) utilisé par l’assistant.

### Option A — Docker

```bash
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=moye_user \
  -e POSTGRES_PASSWORD=moye_password \
  -e POSTGRES_DB=moye_db \
  --name moye-postgres \
  postgres:16


     docker run -d -p 5432:5432 -e POSTGRES_USER=moye_user -e POSTGRES_PASSWORD=moye_password -e POSTGRES_DB=moye_db postgres:16
```

Puis créer les tables et (optionnel) les données :

```bash
cd backend
npx prisma migrate dev
npm run db:seed
```

### Option B — PostgreSQL déjà installé

Créer une base `moye_db` et un utilisateur si besoin, puis dans `backend/.env` :

```
DATABASE_URL="postgresql://moye_user:moye_password@localhost:5432/moye_db"
```

Puis :

```bash
cd backend
npx prisma migrate dev
npm run db:seed
```

---

## Lancer le projet

Il faut **deux terminaux** : un pour le backend, un pour le frontend.

### Terminal 1 — Backend (API)

```bash
cd backend
npm run dev
```

L’API écoute sur **http://localhost:4000**.  
En cas d’échec de connexion à PostgreSQL, le serveur démarre quand même (sans contexte RAG).

### Terminal 2 — Frontend

```bash
npm run dev
```

L’app est servie en HTTPS (souvent **https://localhost:3000**).  
Les appels vers `/api/v1` sont proxyfiés vers le backend (port 4000).

### (Optionnel) Assistant IA — Ollama

Pour que **La Lumière Moyé** réponde en local :

```bash
ollama run llama3:8b
```

Laisser Ollama tourner pendant l’utilisation de l’assistant.

---

## Récapitulatif des commandes

| Action              | Où        | Commande |
|--------------------|-----------|----------|
| Installer le front  | Racine    | `npm install` |
| Installer le back   | `backend/`| `npm install` |
| Lancer le back     | `backend/`| `npm run dev` |
| Lancer le front    | Racine    | `npm run dev` |
| Migrations DB      | `backend/`| `npx prisma migrate dev` |
| Données de démo    | `backend/`| `npm run db:seed` |
| Prisma Studio      | `backend/`| `npm run db:studio` |
| Modèle Ollama      | Machine   | `ollama run llama3:8b` |

---

## URLs utiles

- **Frontend** : https://localhost:3000 (ou l’URL affichée par Vite)
- **Backend API** : http://localhost:4000
- **Health API** : http://localhost:4000/health
- **Assistant Moyé** : POST http://localhost:4000/api/v1/moye (ou via le proxy front `/api/v1/moye`)

---

## Dépannage

- **« Impossible de joindre La Lumière Moyé »** : le backend n’est pas démarré ou pas joignable. Vérifier que `cd backend && npm run dev` tourne et que le proxy Vite cible bien `http://localhost:4000`.
- **« Base de données indisponible »** : PostgreSQL n’est pas lancé ou `DATABASE_URL` est incorrect. Démarrer PostgreSQL (Docker ou service) et relancer le backend.
- **Pas de réponse de l’assistant / erreur 500** : lancer Ollama et le modèle : `ollama run llama3:8b`.
