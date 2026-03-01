-- MOYÉ: Supabase Schema

-- 1. Ethnies
CREATE TABLE ethnies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL UNIQUE,
    region TEXT,
    description TEXT,
    histoire TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rites
CREATE TABLE rites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ethnie_id UUID REFERENCES ethnies(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Gastronomie
CREATE TABLE gastronomie (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ethnie_id UUID REFERENCES ethnies(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    ingredients TEXT[],
    recette TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Langues et Traductions
CREATE TABLE langues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ethnie_id UUID REFERENCES ethnies(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    code TEXT UNIQUE
);

CREATE TABLE mots_traductions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    langue_id UUID REFERENCES langues(id) ON DELETE CASCADE,
    mot_fr TEXT NOT NULL,
    mot_local TEXT NOT NULL,
    phonetique TEXT,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Académie (Quiz & Progrès)
CREATE TABLE quiz (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ethnie_id UUID REFERENCES ethnies(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of {text, isCorrect}
    explication TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE progres_apprentissage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Linked to auth.users
    ethnie_id UUID REFERENCES ethnies(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    niveau TEXT DEFAULT 'Grain de sable',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Podcasts
CREATE TABLE podcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre TEXT NOT NULL,
    conteur TEXT,
    audio_url TEXT NOT NULL,
    description TEXT,
    ethnie_id UUID REFERENCES ethnies(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Data
INSERT INTO ethnies (nom, region, description, histoire, image_url) VALUES 
('Baoulé', 'Centre', 'Le peuple Baoulé est l''un des plus importants groupes ethniques de Côte d''Ivoire.', 'L''histoire des Baoulé commence avec la reine Abla Pokou qui a conduit son peuple de l''actuel Ghana vers le centre de la Côte d''Ivoire.', 'https://picsum.photos/seed/baoule/800/600'),
('Sanwi', 'Sud-Est', 'Le royaume Sanwi est situé dans le sud-est de la Côte d''Ivoire.', 'Le Sanwi est un royaume traditionnel Agni fondé au 18ème siècle.', 'https://picsum.photos/seed/sanwi/800/600');

-- RLS (Row Level Security)
ALTER TABLE ethnies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rites ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastronomie ENABLE ROW LEVEL SECURITY;
ALTER TABLE langues ENABLE ROW LEVEL SECURITY;
ALTER TABLE mots_traductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE progres_apprentissage ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

-- Policies: Public Read Access
CREATE POLICY "Lecture publique pour tous" ON ethnies FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour tous" ON rites FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour tous" ON gastronomie FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour tous" ON langues FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour tous" ON mots_traductions FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour tous" ON quiz FOR SELECT USING (true);
CREATE POLICY "Lecture publique pour tous" ON podcasts FOR SELECT USING (true);

-- Policy: User specific progress
CREATE POLICY "Les utilisateurs voient leur propre progres" ON progres_apprentissage FOR ALL USING (true); 
-- Note: In production, use (auth.uid() = user_id)
