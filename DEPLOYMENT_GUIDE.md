# 🚀 Guide de Déploiement Complet - MOYÉ

Ce guide vous accompagnera pour déployer le projet MOYÉ sur Vercel (Frontend) et Railway (Backend).

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Déploiement Frontend (Vercel)](#déploiement-frontend-vercel)
3. [Déploiement Backend (Railway)](#déploiement-backend-railway)
4. [Configuration du domaine et CORS](#configuration-du-domaine-et-cors)
5. [Variables d'environnement](#variables-denvironnement)
6. [Vérification et tests](#vérification-et-tests)

---

## 📋 Prérequis

- ✅ Compte GitHub (déjà configuré avec le repo `killersd37/moye_ci`)
- ✅ Compte Vercel (gratuit: https://vercel.com)
- ✅ Compte Railway (gratuit: https://railway.app)
- ✅ Les fichiers de configuration (`vercel.json`, `railway.json`) sont déjà créés
- ✅ `.env` et `.env.example` sont configurés

---

## 🌐 Déploiement Frontend (Vercel)

### Étape 1: Créer un compte Vercel
1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec GitHub
4. Autorisez l'accès à vos repos

### Étape 2: Importer le projet
1. Sur le tableau de bord Vercel, cliquez **"Add New..."** → **"Project"**
2. Sélectionnez le repo **`killersd37/moye_ci`**
3. Vercel détectera automatiquement que c'est un projet Vite React

### Étape 3: Configurer les variables d'environnement
1. Dans les **"Environment Variables"**, ajoutez:
   ```
   VITE_GEMINI_API_KEY = votre_clé_api_gemini
   VITE_SUPABASE_URL = https://oegjkfygdtnlandlqsuk.supabase.co
   VITE_SUPABASE_ANON_KEY = votre_clé_supabase
   VITE_HUGGINGFACE_API_KEY = votre_clé_huggingface (optionnel)
   ```

2. Cliquez sur **"Build and Deploy"**

### Étape 4: Attendre le déploiement
- Vercel construira automatiquement: `npm run build`
- Servira depuis le répertoire `dist/` (configuré dans `vercel.json`)
- Vous recevrez une URL: `https://moye-xxx.vercel.app`

✅ **Frontend déployé!**

---

## 🔧 Déploiement Backend (Railway)

### Étape 1: Créer un compte Railway
1. Allez sur https://railway.app
2. Cliquez sur **"Start Project"**
3. Connectez-vous avec GitHub

### Étape 2: Créer le projet Backend
1. Dans le tableau de bord, cliquez **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Cherchez et sélectionnez **`killersd37/moye_ci`**
4. Railway détectera le Dockerfile

### Étape 3: Ajouter PostgreSQL
1. Cliquez sur **"Add Services"** → **"Add from marketplace"**
2. Sélectionnez **"PostgreSQL"**
3. Railway crée automatiquement une BD et fournit une `DATABASE_URL`

### Étape 4: Configurer les variables d'environnement
1. Cliquez sur le service **Backend**
2. Allez dans **"Variables"**
3. Ajoutez les variables (générez des secrets forts):

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/db (auto-généré par Railway)
API_PREFIX=/api/v1
JWT_SECRET=votre_secret_jwt_aleatoire_32_caracteres
JWT_REFRESH_SECRET=votre_refresh_secret_aleatoire_32_caracteres
CORS_ORIGIN=https://moye-xxx.vercel.app (remplacer par votre URL Vercel)
GEMINI_API_KEY=votre_clé_gemini
OLLAMA_BASE_URL=http://localhost:11434 (optionnel)
OLLAMA_MODEL=llama3:8b (optionnel)
```

### Étape 5: Configurer le déploiement
1. Dans le service Backend, allez dans **"Deployment"**
2. Définissez:
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Build Command**: `AUTO` (ou `npm run build`)
   - **Start Command**: `npm start`

### Étape 6: Déployer
- Cliquez sur **"Deploy"**
- Railway construit et démarre le backend
- URL fournie: `https://moye-backend-xxx.up.railway.app`

✅ **Backend déployé!**

---

## 🔗 Configuration du domaine et CORS

### Récupérer les URLs de déploiement

**Frontend (Vercel):**
```
https://moye-xxx.vercel.app
```

**Backend (Railway):**
```
https://moye-backend-xxx.up.railway.app
```

### Mettre à jour CORS
1. Dans Railway Backend → **Variables**
2. Mettez à jour `CORS_ORIGIN` avec votre URL Vercel:
   ```
   CORS_ORIGIN=https://moye-xxx.vercel.app
   ```

### Mettre à jour l'URL du Frontend
1. Dans Vercel Frontend → **Environment Variables**
2. Ajoutez/mettez à jour:
   ```
   VITE_API_URL=https://moye-backend-xxx.up.railway.app
   ```

---

## 🔐 Variables d'environnement

### Frontend (.env)
```env
VITE_GEMINI_API_KEY=your_key
VITE_SUPABASE_URL=https://oegjkfygdtnlandlqsuk.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=votre_secret_long_et_aleatoire
CORS_ORIGIN=https://moye-xxx.vercel.app
GEMINI_API_KEY=your_key
```

> ⚠️ **Ne commettez JAMAIS les vraies clés API dans Git!**

---

## ✅ Vérification et tests

### 1. Vérifier le Frontend
```bash
curl https://moye-xxx.vercel.app
# Doit retourner le HTML minifié
```

### 2. Vérifier le Backend
```bash
curl https://moye-backend-xxx.up.railway.app/health
# Doit retourner: {"status":"ok"}
```

### 3. Tester la connexion API
- Ouvrez: `https://moye-xxx.vercel.app`
- Allez dans DevTools → Network
- Ouvrez une page qui appelle l'API
- Vérifiez que les requêtes → `moye-backend-xxx.up.railway.app/api/v1/...` réussissent

### 4. Vérifier les logs
**Vercel:**
- Tableau de bord → Project → Logs

**Railway:**
- Tableau de bord → Backend Service → Logs

---

## 🐛 Dépannage courant

### Erreur CORS
- Vérifiez `CORS_ORIGIN` dans Railway
- Doit égaler exactement l'URL du frontend

### PDO doesn't exist
- PostgreSQL n'est pas prêt dans Railway
- Attendez 2-3 minutes et redéployez

### 502 Bad Gateway
- Backend s'est écrasé
- Vérifiez les logs Railway
- Vérifiez `DATABASE_URL`

### API en timeout
- Augmentez le timeout dans Vite config (déjà à 300000ms)
- Vérifiez la BD sur Railway

---

## 📚 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Railway](https://docs.railway.app)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✨ Résumé rapide

```bash
# 1. Frontend: Connectez GitHub repo à Vercel
# 2. Backend: Connectez GitHub repo à Railway + ajoutez PostgreSQL
# 3. Configurez les variables d'env sur les deux
# 4. Mettez à jour CORS_ORIGIN dans Railway
# 5. Testez les URLs et les appels API
```

🎉 **Bravo! Votre projet est en ligne!**
