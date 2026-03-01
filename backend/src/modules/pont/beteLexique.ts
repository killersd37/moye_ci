export type BeteEntry = {
    bete: string;
    francais: string[];
    categorie: string;
    theme: string;
};

// Base lexicale Bété ↔ Français (synchronisée avec le PDF bete-francais.pdf)
export const beteLexique: BeteEntry[] = [
    // =========================
    // SALUTATIONS & CIVILITÉ
    // =========================
    { bete: 'Ayo', francais: ['Bonjour', 'Bonsoir', 'Salut'], categorie: 'Expression', theme: 'Salutation' },
    { bete: 'A Ayoka', francais: ['Salut à tous'], categorie: 'Expression', theme: 'Salutation' },
    { bete: 'Yiaho', francais: ['Merci', 'Bravo'], categorie: 'Expression', theme: 'Civilité' },
    { bete: 'Yaya', francais: ['Pardon', 'Désolé'], categorie: 'Expression', theme: 'Civilité' },
    { bete: 'A djié', francais: ['Bonne nuit'], categorie: 'Expression', theme: 'Salutation' },
    { bete: 'Blié', francais: ['Au revoir'], categorie: 'Expression', theme: 'Salutation' },
    { bete: 'ayo ya', francais: ['Bienvenue'], categorie: 'Expression', theme: 'Salutation' },
    { bete: 'A sêh', francais: ['Bienvenue (à plusieurs)'], categorie: 'Expression', theme: 'Salutation' },

    // =========================
    // DIVERS
    // =========================
    { bete: 'Gninhou', francais: ['Donne'], categorie: 'Expression / Nom', theme: 'Divers' },
    { bete: 'Gninhou gnou', francais: ["Donne moi de l'eau"], categorie: 'Expression / Nom', theme: 'Divers' },
    { bete: 'Gni', francais: ['Nom'], categorie: 'Nom', theme: 'Divers' },
    { bete: 'Tchi', francais: ['Poisson', 'Demain'], categorie: 'Nom', theme: 'Divers' },

    // =========================
    // FAMILLE
    // =========================
    { bete: 'Gounoudi', francais: ['Homme', 'Humain'], categorie: 'Nom / Verbe', theme: 'Famille' },
    { bete: 'Na goudio', francais: ['Mon Mari'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Na gonnon', francais: ['Ma Femme'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Oma', francais: ['Mère'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Ato', francais: ['Père'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'You', francais: ['Enfant'], categorie: 'Nom / Adjectif', theme: 'Famille' },
    { bete: 'Ato Godio', francais: ['Grand-père'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Anon Godio', francais: ['Grand-mère'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Anonn wroui', francais: ['Frère', 'Sœur'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Anon gonon', francais: ['Sœur'], categorie: 'Nom', theme: 'Famille' },
    { bete: 'Lagô', francais: ['Dieu'], categorie: 'Nom', theme: 'Spiritualité' },

    // =========================
    // NOURRITURE & ÉCONOMIE
    // =========================
    { bete: 'Gnou', francais: ['Eau'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: 'Yi aka li', francais: ['Viens on va manger'], categorie: 'Expression', theme: 'Nourriture' },
    { bete: 'Bhê', francais: ['Pain', 'Nourriture'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: 'Kôkô', francais: ['Banane'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: 'Soukou', francais: ['Sucre'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: "N'mê", francais: ['Viande'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: 'Djè', francais: ['Argent'], categorie: 'Nom', theme: 'Économie' },
    { bete: 'Sokô', francais: ['Piment'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: 'Saka', francais: ['Riz'], categorie: 'Nom', theme: 'Nourriture' },
    { bete: 'dodo', francais: ['Terre', 'Sol'], categorie: 'Nom', theme: 'Nature' },
    { bete: 'Djé', francais: ['Acheter'], categorie: 'Verbe', theme: 'Économie' },
    { bete: 'Wlé', francais: ['Vendre'], categorie: 'Verbe', theme: 'Économie' },

    // =========================
    // ANIMAUX
    // =========================
    { bete: 'Djiz', francais: ['Panthère', 'Parole'], categorie: 'Nom', theme: 'Animal / Concept' },
    { bete: 'Goli', francais: ['Chien'], categorie: 'Nom', theme: 'Animal' },
    { bete: 'Moulou', francais: ['Chat'], categorie: 'Nom', theme: 'Animal' },
    { bete: 'Glou', francais: ['Escargot'], categorie: 'Nom', theme: 'Animal' },
    { bete: 'Kôka', francais: ['Poule'], categorie: 'Nom', theme: 'Animal' },
    { bete: 'Lakoda', francais: ['Éléphant'], categorie: 'Nom', theme: 'Animal' },

    // =========================
    // VERBES
    // =========================
    { bete: 'Li', francais: ['Manger'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Nou', francais: ['Boire'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Yé', francais: ['Voir'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'O', francais: ['Faire'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Mounou', francais: ['Dormir'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Yi', francais: ['Venir'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Mou', francais: ['Aller'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Gnigui', francais: ['Chercher'], categorie: 'Verbe', theme: 'Action' },
    { bete: 'Pli', francais: ['Courir'], categorie: 'Verbe', theme: 'Action' },

    // =========================
    // NUMÉROTATION
    // =========================
    { bete: "m'molo", francais: ['Un'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'shô', francais: ['Deux'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Ta', francais: ['Trois'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Monna', francais: ['Quatre'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Gbéeh', francais: ['Cinq'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Gbéeh prou', francais: ['Six'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Gbéeh prou gbo shô', francais: ['Sept'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Gba tha', francais: ['Huit'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Gbo siyait na', francais: ['Neuf'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba', francais: ['Dix'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: "Kou Gba m'molo", francais: ['Onze'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba shô', francais: ['Douze'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba Ta', francais: ['Treize'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba Monna', francais: ['Quatorze'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba Gbéeh', francais: ['Quinze'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba Gbéeh prou', francais: ['Seize'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba Gbéeh prou gbo shô', francais: ['Dix-Sept'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba tha', francais: ['Dix-Huit'], categorie: 'Adjectif', theme: 'Numérotation' },
    { bete: 'Kou Gba Gbo siyait na', francais: ['Dix-Neuf'], categorie: 'Adjectif', theme: 'Numérotation' },
];

const normalize = (s: string) =>
    s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

export function translateBeteToFrancais(texteSource: string): string | null {
    const norm = normalize(texteSource);
    const entry = beteLexique.find((e) => e.bete && normalize(e.bete) === norm);
    return entry?.francais[0] ?? null;
}

export function translateFrancaisToBete(texteSource: string): string | null {
    const norm = normalize(texteSource);
    const entry = beteLexique.find((e) => e.francais.some((f) => normalize(f) === norm));
    return entry?.bete || null;
}

