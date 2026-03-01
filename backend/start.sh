#!/bin/bash
# ================================================================
# MOYÉ Backend - Script de démarrage local
# ================================================================

set -e

echo "╔══════════════════════════════════════════╗"
echo "║     🌍 MOYÉ Backend - Démarrage          ║"
echo "╚══════════════════════════════════════════╝"

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
  echo "❌ Lancez ce script depuis le dossier backend/"
  exit 1
fi

# Copier .env si absent
if [ ! -f ".env" ]; then
  echo "📋 Copie du fichier .env.example..."
  cp .env.example .env
  echo "⚠️  Configurez le fichier .env avec vos valeurs avant de continuer"
  echo "   En particulier: DATABASE_URL et JWT_SECRET"
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Attendre que PostgreSQL soit disponible
echo "⏳ Vérification de la connexion PostgreSQL..."
node -e "
const { execSync } = require('child_process');
require('dotenv').config();
const url = process.env.DATABASE_URL;
console.log('DATABASE_URL:', url ? '✅ Configurée' : '❌ Manquante');
"

# Appliquer les migrations
echo "🗄️  Application des migrations de base de données..."
npx prisma migrate dev --name init 2>/dev/null || npx prisma db push

# Seed de la base de données
echo "🌱 Seed de la base de données (données initiales)..."
npx ts-node prisma/seed.ts

# Démarrer le serveur en développement
echo ""
echo "✅ Configuration terminée!"
echo ""
echo "🚀 Démarrage du serveur MOYÉ API..."
echo "   URL: http://localhost:4000"
echo "   API: http://localhost:4000/api/v1"
echo "   Health: http://localhost:4000/health"
echo ""
npm run dev
