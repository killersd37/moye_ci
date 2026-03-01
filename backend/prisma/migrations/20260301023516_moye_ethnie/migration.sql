-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EXPERT_CULTUREL');

-- CreateEnum
CREATE TYPE "NiveauType" AS ENUM ('GRAIN_DE_SABLE', 'PALMIER', 'BAOBAB');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "moyeOrPoints" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastActiveAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethnies" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "groupeLinguistique" TEXT,
    "populationEstimee" INTEGER,
    "langues" TEXT[],
    "description" TEXT,
    "origines" TEXT,
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ethnies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histoires" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "periode" TEXT,
    "imageUrl" TEXT,
    "ethnieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "histoires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rites" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "signification" TEXT,
    "periode" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "ethnieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objets_culturels" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "signification" TEXT,
    "matiere" TEXT,
    "epoque" TEXT,
    "imageUrl" TEXT,
    "tags" TEXT[],
    "ethnieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objets_culturels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastronomies" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT[],
    "preparation" TEXT,
    "occasion" TEXT,
    "imageUrl" TEXT,
    "ethnieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastronomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fetes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "periode" TEXT,
    "lieu" TEXT,
    "imageUrl" TEXT,
    "ethnieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "langues" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nomLocal" TEXT,
    "famille" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "langues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mots" (
    "id" TEXT NOT NULL,
    "mot" TEXT NOT NULL,
    "phonetique" TEXT,
    "categorie" TEXT,
    "langueId" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traductions" (
    "id" TEXT NOT NULL,
    "texteSource" TEXT NOT NULL,
    "texteTraduction" TEXT NOT NULL,
    "langueSourceId" TEXT NOT NULL,
    "langueCibleId" TEXT NOT NULL,
    "contexte" TEXT,
    "validee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traductions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canaux_discussion" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canaux_discussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "langueCode" TEXT NOT NULL DEFAULT 'fr',
    "traductions" JSONB,
    "audioUrl" TEXT,
    "userId" TEXT NOT NULL,
    "canalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveaux" (
    "id" TEXT NOT NULL,
    "type" "NiveauType" NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "pointsRequis" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "ordre" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecons" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "contenu" TEXT NOT NULL,
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "pointsGain" INTEGER NOT NULL DEFAULT 10,
    "dureeMin" INTEGER NOT NULL DEFAULT 5,
    "niveauId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "enonce" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'choix_multiple',
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "explication" TEXT,
    "leconId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reponses" (
    "id" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "estCorrecte" BOOLEAN NOT NULL DEFAULT false,
    "explication" TEXT,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "condition" TEXT NOT NULL,
    "pointsBonus" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "obtenuLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progressions_utilisateur" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "niveauId" TEXT NOT NULL,
    "leconId" TEXT,
    "pointsGagnes" INTEGER NOT NULL DEFAULT 0,
    "completee" BOOLEAN NOT NULL DEFAULT false,
    "scoreQuiz" INTEGER,
    "tentatives" INTEGER NOT NULL DEFAULT 1,
    "completeeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progressions_utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcasts" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "dureeSecondes" INTEGER,
    "tags" TEXT[],
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "views" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "auteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ongs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "logoUrl" TEXT,
    "siteWeb" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "localisation" TEXT,
    "domaine" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "responsableId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ongs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artisans" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "specialite" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "localisation" TEXT,
    "contact" TEXT,
    "ongId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artisans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_pseudo_key" ON "users"("pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "regions_nom_key" ON "regions"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "ethnies_nom_key" ON "ethnies"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "ethnies_slug_key" ON "ethnies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "langues_code_key" ON "langues"("code");

-- CreateIndex
CREATE UNIQUE INDEX "mots_mot_langueId_key" ON "mots"("mot", "langueId");

-- CreateIndex
CREATE UNIQUE INDEX "canaux_discussion_slug_key" ON "canaux_discussion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "niveaux_type_key" ON "niveaux"("type");

-- CreateIndex
CREATE UNIQUE INDEX "badges_nom_key" ON "badges"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- AddForeignKey
ALTER TABLE "ethnies" ADD CONSTRAINT "ethnies_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histoires" ADD CONSTRAINT "histoires_ethnieId_fkey" FOREIGN KEY ("ethnieId") REFERENCES "ethnies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rites" ADD CONSTRAINT "rites_ethnieId_fkey" FOREIGN KEY ("ethnieId") REFERENCES "ethnies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objets_culturels" ADD CONSTRAINT "objets_culturels_ethnieId_fkey" FOREIGN KEY ("ethnieId") REFERENCES "ethnies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastronomies" ADD CONSTRAINT "gastronomies_ethnieId_fkey" FOREIGN KEY ("ethnieId") REFERENCES "ethnies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fetes" ADD CONSTRAINT "fetes_ethnieId_fkey" FOREIGN KEY ("ethnieId") REFERENCES "ethnies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mots" ADD CONSTRAINT "mots_langueId_fkey" FOREIGN KEY ("langueId") REFERENCES "langues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traductions" ADD CONSTRAINT "traductions_langueSourceId_fkey" FOREIGN KEY ("langueSourceId") REFERENCES "langues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traductions" ADD CONSTRAINT "traductions_langueCibleId_fkey" FOREIGN KEY ("langueCibleId") REFERENCES "langues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "canaux_discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecons" ADD CONSTRAINT "lecons_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "niveaux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_leconId_fkey" FOREIGN KEY ("leconId") REFERENCES "lecons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reponses" ADD CONSTRAINT "reponses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions_utilisateur" ADD CONSTRAINT "progressions_utilisateur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progressions_utilisateur" ADD CONSTRAINT "progressions_utilisateur_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "niveaux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcasts" ADD CONSTRAINT "podcasts_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ongs" ADD CONSTRAINT "ongs_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artisans" ADD CONSTRAINT "artisans_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
