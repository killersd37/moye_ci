// Dictionnaire des 6 ethnies de Côte d'Ivoire
import { dioulaData } from './dioula';
// Structure: [expression_locale, traduction_française]

export type DictionaryEntry = {
    expression: string;
    traduction: string;
    langue: string;
};

export const LANGUES = ['Baoulé', 'Bété', 'Sénoufo', 'Yacouba', 'Agni', 'Dioula'] as const;
export type Langue = (typeof LANGUES)[number];

export const LANGUES_WITH_FR = ['Français', ...LANGUES] as const;
export type LangueOrFr = (typeof LANGUES_WITH_FR)[number];

const rawDatabase: Record<string, [string, string][]> = {
    "Dioula": [
        // ── Lexique de mots courants (nécessaire pour la traduction croisée via pivot français) ──
        ["I ni sogoma", "Bonjour (matin)"], ["I ni tile", "Bonjour (journée)"], ["I ni wula", "Bonsoir"],
        ["I ni ce", "Bonjour"], ["Aw ni ce", "Bonjour (pluriel)"], ["A ni ce", "Bonjour (à lui/elle)"],
        ["I ni baara", "Merci (pour le travail)"], ["Aw ni baara", "Merci"],
        ["Aw ni kɛnɛ", "Bonne santé / Bonjour"], ["I ka kɛnɛ ?", "Ça va ?"],
        ["N ka kɛnɛ", "Ça va bien"], ["Kana kɛ", "Ce n'est rien"], ["Tɔgɔ", "Nom"],
        ["I tɔgɔ ka di ?", "Comment tu t'appelles ?"], ["Ka kɛ aw bolo", "Bienvenue"],
        ["Kana bɔ!", "Au revoir!"], ["Sɔrɔ", "Trouver"], ["Bɔ", "Sortir / Partir"],
        ["N'i nɛ", "Merci"], ["I ni kɛnɛ", "Salut / Bonjour"], ["Dɔɔni", "Un peu"],
        ["Jɔ", "S'arrêter"], ["Sigi", "S'asseoir"], ["Wuli", "Se lever"],
        ["Ko di?", "Comment ça va?"], ["Nba", "Oui"], ["Ayi", "Non"],
        ["Jɔ", "Arrêter"], ["Kɔfɛ", "Derrière"], ["Kɔn", "Ventre"],
        ["Ji", "Eau"], ["Dùgu", "Terre / Village"], ["Yɛrɛ", "Soi-même"],
        ["Yɔrɔ", "Endroit / Là"], ["Sɔgɔ", "Viande"], ["Tɔw", "Chef / Aîné"],
        ["Ke", "Homme"], ["Muso", "Femme"], ["Dɔn", "Entrer / Savoir"],
        ["Den", "Enfant"], ["Faa", "Père"], ["Ba", "Mère"],
        ["Kɔ", "Potager / Derrière"], ["Dugu", "Village / Sol"], ["Wɛwɛ", "Vrai"],
        ["Gafe", "Livre"], ["Calon", "Cœur"], ["Juru", "Corde"],
        ["Tɛmɛ", "Traverser / Passer"], ["Se", "Arriver / Pouvoir"],
        ["Fɛn", "Chose"], ["Mɔgɔ", "Personne / Gens"], ["Bɛɛ", "Tout"],
        ["Bi", "Aujourd'hui"], ["Sini", "Demain"], ["Kunu", "Hier"],
        ["Tile", "Soleil / Journée"], ["Su", "Nuit"], ["Kalo", "Lune / Mois"],
        ["Sanfɛ", "Ciel / En haut"], ["Sigi", "Poser / Asseoir"],
        ["Ne", "Moi"], ["I", "Toi"], ["A", "Il/Elle"],
        ["An", "Nous (inclusif)"], ["Aw", "Vous"], ["Olu", "Eux/Elles"],
        ["Bɔɔrɔ", "Bœuf"], ["Wulu", "Chien"], ["Jakuma", "Chat"],
        ["Kɔnɔ", "Oiseau"], ["Jegan", "Poisson"], ["Gɛrɛfɛn", "Animal"],
        ["Murujan", "Couteau"], ["Kɛnɛ", "Santé / Bien portant"],
        ["Bana", "Maladie"], ["Dɔgɔtɔrɔ", "Médecin"], ["Farali", "Médicament"],
        ["Kalan", "Étudier / Lire"], ["Kalan cɛ", "École / Études"],
        ["Baara", "Travail"], ["Sɛnɛ", "Agriculture / Cultiver"],
        ["Sogo", "Viande (général)"], ["Dɔ", "Certain / Quelque chose"],
        ["Tuma", "Temps / Moment"], ["Fɔlɔ", "Premièrement / D'abord"],
        ["Tuma bɛɛ", "Toujours"], ["Sɔrɔla", "Obtenu / Trouvé"],
        ["O", "Ça / Ce / Cela"], ["La", "Sur / En / Par (postposition)"],
        ["Ka", "De / Et (infinitif)"], ["Ye", "A / Est (auxiliaire)"],
        ["Bɛ", "Est / Se trouve (présent)"], ["Tɛ", "Ne pas / Il n'y a pas"],
        ["Nɔ", "Ici / Dans"], ["Kɔ", "Après / Derrière"],
        ["Nin", "Ceci / Ce"], ["Kɛ", "Faire"], ["Jo", "Prendre"],
        ["Boli", "Courir"], ["Wali", "Jouer / Danser"], ["Fe", "Vouloir / Désirer"],
        ["Makɔnɔ", "Attendre"], ["Fɔ", "Dire"], ["Kuma", "Parler"],
        ["Nyɔgɔn", "L'un l'autre / Ensemble"], ["Sɔn", "Accepter / Consentir"],
        ["Nɛ", "Couteau (petit)"], ["Yɛlɛma", "Changer"],
        ["Nɔ", "Aimer"], ["Yay", "Mère (affectueux)"], ["Fa", "Père (affectueux)"],
        ["Kise", "Sac"], ["Dilan", "Porte"], ["So", "Maison / Cheval"],
        ["Foro", "Champ"], ["Tasuma", "Feu / Flamme"], ["Ji bonda", "Rivière"],
        ["Fɔlɔ", "Premier"], ["Filanan", "Deuxième"], ["Sabanan", "Troisième"],
        ["Kelen", "Un / Seul"], ["Fila", "Deux"], ["Saba", "Trois"],
        ["Nani", "Quatre"], ["Duuru", "Cinq"], ["Wɔɔrɔ", "Six"],
        ["Wolonfila", "Sept"], ["Segin", "Huit"], ["Kɔnɔntɔ", "Neuf"], ["Tan", "Dix"],
        ["Keme", "Cent"], ["Waa", "Mille"], ["Dɔlɔ", "Bière de mil"],
        ["Nono", "Lait"], ["Dege", "Bouillie (mil)"], ["Tiga", "Arachide"],
        ["Malo", "Riz"], ["Tɔ", "Tô (pâte)"], ["Jaba", "Oignon"],
        ["Furu", "Se marier / Mariage"], ["Furuli", "Divorce"],
        ["Dugutigi", "Chef de village"], ["Cɛ", "Homme adulte"],
        ["Maralikɛla", "Commerçant"], ["Sɛnɛkɛla", "Agriculteur"],
        ...dioulaData,
    ],
    "Baoulé": [
        ["N'dié", "Bonjour"], ["N'vrou", "Bonsoir"], ["Mo", "Merci"], ["Mo n'zue", "Félicitations"], ["Ô tché ?", "Comment ça va ?"], ["Ô ti kpa", "Ça va bien"], ["Koussê", "Pardon"], ["Mo kôyo", "Bienvenue"], ["Amon ni", "Au revoir"], ["Nanan", "Chef"], ["Blohoun", "Blanc"], ["N'dri", "3e fils"], ["N'goran", "9e fils"], ["Affoué", "Vendredi"], ["Amenan", "Samedi"], ["Akwaba", "Bienvenue"], ["N'da", "Jumeau"], ["N'guessan", "9e enfant"], ["Alou", "Nom fille"], ["Bla", "Femme"], ["N'zue", "Eau"], ["Alié", "Nourriture"], ["Sran", "Personne"], ["Ba", "Enfant"], ["Yasoua", "Homme"], ["Taloua", "Jeune fille"], ["Djè", "Argent"], ["N'vrou", "Sommeil"], ["Ouan", "Qui ?"], ["Kpon", "Pain"], ["Floko", "Mensonge"], ["Su", "Sur"], ["N'glô", "Ciel"], ["Asié", "Terre"], ["Tô", "Tomber"], ["Lô", "Là-bas"], ["Iwa", "Ici"], ["Kômian", "Prêtre"], ["Nan", "Boire"], ["Sika", "Or"], ["N'gomon", "Piment"], ["Bé", "Ils"], ["Siman", "Tabac"], ["Klô", "Village"], ["Di", "Manger"], ["Nou", "Boire"], ["Nantin", "Marcher"], ["Wan", "Dire"], ["Kan", "Parler"], ["Di nanan", "Régner"], ["Kpô", "Sauter"], ["Wu", "Accoucher"], ["Kô", "Aller"], ["Bla", "Venir"], ["Ni", "Voir"], ["Non", "Têter"], ["Boutou", "Coucher"], ["Jô", "Asseoir"], ["Soun", "Pleurer"], ["Kpan", "Crier"], ["Di d'jè", "Vendre"], ["Ti", "Entendre"], ["Si", "Savoir"], ["Klô", "Aimer"], ["Kpin", "Pousser"], ["Tou", "Voler"], ["Gnan", "Avoir"], ["Man", "Donner"], ["Fa", "Prendre"], ["Dou", "Arriver"], ["Cichi", "Attacher"], ["N'zian", "Attendre"], ["Tchan", "Rester"], ["Findi", "Ouvrir"], ["Doua", "Pluie"], ["N'zue ba", "Rivière"], ["N'zue dan", "Fleuve"], ["Bali", "Chien"], ["Goli", "Masque"], ["Yao", "Jeudi"], ["Kouadio", "Mardi"], ["Koffi", "Vendredi"], ["Konan", "Mercredi"], ["Kouamé", "Samedi"], ["Kouassi", "Dimanche"], ["Jari", "Soleil"], ["Oka", "Lune"], ["Sin", "Sein"], ["N'zué n'gnan", "Soif"], ["Mi kô", "Je pars"], ["Mi bla", "Je viens"], ["Ô ti sè", "C'est dur"], ["Ya", "Douleur"], ["Souclou", "École"], ["N'zassa", "Mélange"], ["Kômin", "Arrivée"], ["Koli", "Fin"], ["Famien", "Roi"], ["Waka", "Arbre"], ["Ami", "Jeudi"],
    ],
    "Bété": [
        ["Abouo", "Bonjour"], ["N'zaza", "Bienvenue"], ["Ayoka", "Merci"], ["O gnini ?", "Ça va ?"], ["Gni ka", "C'est bon"], ["O mami", "À demain"], ["Nazé ?", "Quoi ?"], ["Lagô", "Dieu"], ["Dadié", "Père"], ["Nô", "Mère"], ["Dô", "Petit frère"], ["Té", "Grand frère"], ["Sou", "Ami"], ["Toukpa", "Doucement"], ["N'zré", "Route"], ["Ni", "Tête"], ["You", "Œil"], ["Gnon", "Bouche"], ["Nonon", "Sein"], ["Kou", "Mort"], ["Gnou", "Eau"], ["Dié", "Ventre"], ["Gbô", "Pied"], ["Lou", "Maison"], ["Né", "Enfant"], ["Gnonkou", "Frère"], ["Bli", "Bœuf"], ["Soum", "Arbre"], ["Té", "Feu"], ["Djidji", "Froid"], ["Télé", "Soleil"], ["You", "Lune"], ["Gnoum", "Étoile"], ["Bô", "Terre"], ["Zé", "Jour"], ["Koutou", "Nuit"], ["Gnan", "Sang"], ["Won", "Parole"], ["Nou", "Entendre"], ["Li", "Manger"], ["Nou", "Boire"], ["Sia", "Courir"], ["Wa", "Partir"], ["Bla", "Venir"], ["Yi", "Voir"], ["Di", "Dire"], ["Gna", "Prendre"], ["Kou", "Tuer"], ["Ma", "Porter"], ["Sé", "Rester"], ["Lô", "Se lever"], ["Nran", "Marcher"], ["Won", "Parler"], ["Gnin", "Dormir"], ["Kpa", "Sauter"], ["Tou", "Frapper"], ["Bli", "Ouvrir"], ["Gba", "Fermer"], ["Do", "Jeter"], ["Ka", "Couper"], ["Ni", "Chanter"], ["Sa", "Danser"], ["Ti", "Cuisiner"], ["Pi", "Laver"], ["Lo", "Chercher"], ["Ze", "Trouver"], ["Dou", "Pleurer"], ["Ni", "Rire"], ["Soko", "Pagne"], ["Gbaké", "Assiette"], ["Djédjé", "Couteau"], ["Boka", "Montagne"], ["Koum", "Forêt"], ["Zaza", "Marché"], ["Bali", "Chien"], ["Gbolou", "Lion"], ["Gnibi", "Serpent"], ["Télé-non", "Lumière"], ["You-nou", "Larme"], ["Dou", "Ville"], ["Gbô-ni", "Trace"], ["Lou-won", "Clé"], ["Djaka", "Musique"], ["Blignon", "Chef"], ["Lago-gnon", "Ange"], ["Souhou", "Sable"], ["Bli-lou", "Enclos"], ["Gnon-zi", "Mariage"], ["N'zassa", "Mélange"], ["Doukrou", "Village"], ["Gbagbadè", "Vérité"], ["Ouan", "Qui ?"], ["Nazé-lo", "Pourquoi ?"], ["Kpé", "Force"], ["Gni-gbô", "Grand"], ["Tou-lou", "Petit"], ["Zé-non", "Noir"], ["Lagô-poutou", "Ciel"],
    ],
    "Sénoufo": [
        ["Tadjinn", "Bonjour"], ["Mi pwo", "Merci"], ["Fotamana", "Bienvenue"], ["Yeni a kadi ?", "Ça va ?"], ["Kadi kpa", "Bien"], ["Kagôh", "Fini"], ["Tié", "Travail"], ["Mi", "Moi"], ["Gnè", "Toi"], ["Koulô", "Village"], ["Ca'a", "Père"], ["Nouô", "Mère"], ["Pié", "Enfant"], ["Poro", "Initiation"], ["Bolon", "Case"], ["N'gô", "Eau"], ["Djidja", "Feu"], ["Soun", "Lune"], ["Sigué", "Viande"], ["Kah", "Maison"], ["Kôri", "Champ"], ["Fari", "Pagne"], ["Gnou", "Tête"], ["Kpar", "Pied"], ["Sinsoun", "Ventre"], ["Koutchan", "Dos"], ["N'gônon", "Homme"], ["Lou", "Femme"], ["Tchan", "Jour"], ["Wô", "Arbre"], ["Pô", "Herbe"], ["Sé", "Terre"], ["Gnan", "Ciel"], ["M'ba", "Lui"], ["M'hi", "Nous"], ["Lô", "Là-bas"], ["Won", "Ici"], ["Ly", "Manger"], ["Nou", "Boire"], ["Kpa", "Marcher"], ["Tché", "Parler"], ["Gnan", "Voir"], ["Fa", "Prendre"], ["Don", "Entrer"], ["Ta", "Trouver"], ["Ni", "Aller"], ["Wa", "Venir"], ["Gnin", "Dormir"], ["Kou", "Mourir"], ["Ma", "Porter"], ["Lô", "Écouter"], ["Kan", "Dire"], ["Soun", "Pleurer"], ["Pan", "Rire"], ["Yé", "Sauter"], ["Tin", "Frapper"], ["Ka", "Couper"], ["Sou", "Chanter"], ["Gou", "Danser"], ["Bi", "Laver"], ["Toum", "Arc"], ["Gou", "Tambour"], ["Gni", "Masque"], ["Si", "Peur"], ["Mi", "Joie"], ["Ka", "Guerre"], ["Won", "Paix"], ["Dou", "Ville"], ["Ban", "Route"], ["San", "Air"], ["Gon", "Oiseau"], ["Kpa", "Chien"], ["Re", "Serpent"], ["Malo", "Riz"], ["Namasa", "Banane"], ["Worosso", "Tabac"], ["Sé", "Sel"], ["Pi", "Huile"], ["Ka", "Piment"], ["Tié", "Travailler"], ["N'da", "Donner"], ["Foun", "Blanc"], ["Pin", "Noir"], ["Gnié", "Rouge"], ["Tchéré", "Petit"], ["Gbahan", "Grand"], ["Sé", "Savoir"], ["Kou", "Vieux"], ["Pié", "Bébé"], ["N'gnon", "Frère"], ["Tché", "Sœur"], ["Lou", "Mariage"], ["Kpar", "Chaussure"], ["Kô", "Derrière"], ["Yé", "Devant"], ["Sou", "Mil"], ["Tcha", "Aujourd'hui"], ["Soun", "Demain"], ["N'vô", "Hier"], ["Kou-lo", "Cimetière"],
    ],
    "Yacouba": [
        ["A mou zia", "Bonjour"], ["Ba lassi", "Merci"], ["Ko dion ?", "Ça va ?"], ["A gni", "Bien"], ["Ma", "Maman"], ["Bâ", "Papa"], ["Sou", "Demain"], ["Ka", "Toi"], ["Wa", "Aller"], ["Di", "Nom"], ["Da", "Bouche"], ["Yi", "Eau"], ["Tou", "Forêt"], ["Gban", "Montagne"], ["Lou", "Maison"], ["Glon", "Danse"], ["Mé", "Personne"], ["Sran", "Lune"], ["Gnon", "Soleil"], ["Mi", "Terre"], ["Ti", "Feu"], ["Dou", "Village"], ["Za", "Marché"], ["Kou", "Mort"], ["Gbi", "Bruit"], ["Nan", "Pied"], ["Non", "Main"], ["Kpa", "Tête"], ["Wou", "Œil"], ["Gnon", "Dent"], ["Ni", "Oreille"], ["Bla", "Dos"], ["Dou", "Ventre"], ["Gbe", "Blanc"], ["Tou", "Noir"], ["Gban", "Rouge"], ["Mi", "Vert"], ["Sou", "Petit"], ["Ka", "Grand"], ["Wa", "Beau"], ["Bé", "Manger"], ["Min", "Boire"], ["Sé", "Marcher"], ["Gni", "Parler"], ["Kan", "Voir"], ["Pan", "Sauter"], ["Tan", "Frapper"], ["Lou", "Chanter"], ["Dou", "Danser"], ["Ma", "Dormir"], ["Na", "Venir"], ["Ya", "Aller"], ["Gnan", "Prendre"], ["Kou", "Tuer"], ["Bo", "Sortir"], ["Ni", "Entrer"], ["Dou", "Courir"], ["Gbe", "Rire"], ["Tou", "Pleurer"], ["Gban", "Cuisiner"], ["Mi", "Laver"], ["Sou", "Acheter"], ["Ka", "Vendre"], ["Wa", "Chercher"], ["Di", "Trouver"], ["Do", "Donner"], ["Da", "Demander"], ["De", "Dire"], ["Du", "Rester"], ["Do", "Finir"], ["Di", "Commencer"], ["Gnon", "Mil"], ["Yi", "Eau"], ["Tou", "Brousse"], ["Gban", "Caillou"], ["Lou", "Cour"], ["Glon", "Fétiche"], ["Mé", "Homme"], ["Sran", "Femme"], ["Gnon", "Enfant"], ["Mi", "Vieux"], ["Ti", "Chef"], ["Dou", "Guerre"], ["Za", "Paix"], ["Kou", "Route"], ["Gbi", "Champ"], ["Nan", "Pluie"], ["Non", "Vent"], ["Kpa", "Froid"], ["Wou", "Chaleur"], ["Gnon", "Oiseau"], ["Ni", "Serpent"], ["Bla", "Panthère"], ["Dou", "Sel"], ["Gbe", "Huile"], ["Tou", "Banane"], ["Gban", "Manioc"], ["Mi", "Igname"], ["Sou", "Maïs"], ["Ka", "Viande"], ["Wa", "Poisson"],
    ],
    "Agni": [
        ["Kpa-nwoula", "Bonjour"], ["N'zian kou", "Bonsoir"], ["Mo", "Merci"], ["Étché-o ?", "Ça va ?"], ["Étché kpa", "Ça va bien"], ["Koussê", "Pardon"], ["Akwaba", "Bienvenue"], ["Niamien", "Dieu"], ["Famien", "Roi"], ["Ba", "Enfant"], ["Bla", "Femme"], ["Yasoua", "Homme"], ["N'zue", "Eau"], ["Alié", "Nourriture"], ["Sran", "Personne"], ["Sika", "Argent / Or"], ["Klô", "Village"], ["Alié-di", "Manger"], ["N'zue-nou", "Boire"], ["M'vrou", "Sommeil"], ["Nanin", "Marcher"], ["Eden", "Parler"], ["Kô", "Aller"], ["Bla", "Venir"], ["Ni", "Voir"], ["Soun", "Pleurer"], ["Kpan", "Crier"], ["Tchê", "Donner"], ["Fa", "Prendre"], ["Si", "Savoir"], ["Di Famien", "Régner"], ["N'zassa", "Mélange"], ["Jari", "Soleil"], ["Sira", "Lune / Mois"], ["Waka", "Arbre"], ["Asié", "Terre"], ["N'zue-ba", "Rivière"], ["Anouan", "Bouche"], ["Anyé", "Œil"], ["Assouan", "Oreille"], ["Bolo", "Main"], ["Ja", "Pied"], ["Voun", "Ventre"], ["Ti", "Tête"], ["Ewou", "Mort"], ["N'da", "Jumeau"], ["N'guessan", "9e enfant"], ["Anoh", "Né Mardi"], ["Bla", "Né Samedi"], ["Kouassi", "Né Dimanche"], ["Koffi", "Né Vendredi"], ["Kouamé", "Né Samedi"], ["Konan", "Né Mercredi"], ["Kouadio", "Né Mardi"], ["Yao", "Né Jeudi"], ["Amlan", "Née Jeudi"], ["Amenan", "Née Samedi"], ["Affoué", "Née Vendredi"], ["Adjoua", "Née Lundi"], ["Abinan", "Née Mardi"], ["Niamien-Kaba", "Le Ciel"], ["Doua", "La pluie"], ["An'vran", "Le vent"], ["Tchan", "Le jour"], ["Kôgui", "La nuit"], ["Ounnou", "Le mari"], ["Yi", "L'épouse"], ["Taloua", "Jeune fille"], ["Baka", "Forêt"], ["Ebiri", "Noir"], ["Foufou", "Blanc"], ["Kôkôé", "Rouge"], ["N'gbé", "Vert"], ["Tchan-tchan", "Propre"], ["Findi", "Ouvrir"], ["Tô", "Acheter"], ["Tchua", "Vendre"], ["Gnini", "Chercher"], ["Wun", "Trouver"], ["Kan", "Toucher"], ["Tou", "Sauter"], ["Bo", "Frapper"], ["Sa", "Danser"], ["Edwé", "Chanter"], ["Clon", "Laver"], ["An", "Entendre"], ["Su-clou", "École"], ["Djoufa", "Poche"], ["Wari", "Mariage"], ["Sika-boua", "Coffre-fort"], ["M'bô", "Animal"], ["Bali", "Chien"], ["Wôé", "Serpent"], ["Enon", "Oiseau"], ["Ekouè", "Maïs"], ["M'malo", "Riz"], ["M'mande", "Banane"], ["Koutou", "Manioc"], ["Poyé", "Igname"], ["N'douba", "Piment"],
    ],
};

// Flatten into a searchable list
export const dictionary: DictionaryEntry[] = Object.entries(rawDatabase).flatMap(
    ([langue, entries]) =>
        entries.map(([expression, traduction]) => ({ expression, traduction, langue }))
);

// Search: find dictionary entry matching the query in a specific language
// Supports: Français → Langue locale AND Langue locale → Français
export type SearchResult = {
    expression: string;
    traduction: string;
    langue: string;
    direction: 'fr-to-local' | 'local-to-fr';
    score: number;
};

export function searchDictionary(
    query: string,
    langueFiltre?: string,
    direction: 'fr-to-local' | 'local-to-fr' | 'both' = 'both'
): SearchResult[] {
    if (!query.trim()) return [];

    const q = normalize(query);
    const results: SearchResult[] = [];

    for (const entry of dictionary) {
        if (langueFiltre && entry.langue !== langueFiltre) continue;

        // French → Local
        if (direction === 'fr-to-local' || direction === 'both') {
            const score = matchScore(q, normalize(entry.traduction));
            if (score > 0) {
                results.push({ ...entry, direction: 'fr-to-local', score });
            }
        }

        // Local → French
        if (direction === 'local-to-fr' || direction === 'both') {
            const score = matchScore(q, normalize(entry.expression));
            if (score > 0) {
                results.push({ ...entry, direction: 'local-to-fr', score });
            }
        }
    }

    // Sort by score desc
    return results.sort((a, b) => b.score - a.score);
}

export function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export function matchScore(query: string, target: string): number {
    if (target === query) return 100;
    if (target.startsWith(query)) return 80;
    if (target.includes(query)) return 60;
    if (query.length >= 3 && target.includes(query.substring(0, 3))) return 20;
    return 0;
}

// Get all entries for a specific language, raw
export function getByLangue(langue: string): DictionaryEntry[] {
    return dictionary.filter((e) => e.langue === langue);
}

// ─── Inverted Index: French meaning → { langue → [expressions] } ──────────────
// Built once at startup for O(1) cross-language lookups.
//
// Structure example:
//   "bonjour" → { "Dioula": ["I ni sogoma", "I ni tile"], "Baoulé": ["N'dié"], ... }
type LangMap = Map<string, string[]>;   // langue → list of expressions
const frenchIndex = new Map<string, LangMap>();

for (const entry of dictionary) {
    const key = normalize(entry.traduction); // normalized French meaning
    if (!frenchIndex.has(key)) frenchIndex.set(key, new Map());
    const langMap = frenchIndex.get(key)!;
    if (!langMap.has(entry.langue)) langMap.set(entry.langue, []);
    langMap.get(entry.langue)!.push(entry.expression);
}

// ─── Cross-language translation (pivot via French index) ─────────────────────
export type CrossResult = {
    expression: string;    // mot saisi par l'utilisateur (langue source)
    frenchPivot: string;   // signification française commune (pivot visible)
    cible: string;         // équivalent dans la langue cible
    langue: string;        // langue cible
    score: number;
};

export function crossTranslate(
    query: string,
    from: LangueOrFr,
    to: LangueOrFr
): CrossResult[] {
    if (!query.trim() || from === to) return [];
    const q = normalize(query);

    // ── Français → Langue locale ──────────────────────────────────────────────
    if (from === 'Français' && to !== 'Français') {
        const results: CrossResult[] = [];
        for (const [normFr, langMap] of frenchIndex) {
            const score = matchScore(q, normFr);
            if (score === 0) continue;
            const targets = langMap.get(to);
            if (!targets) continue;
            // Find the original (non-normalized) French word
            const sample = dictionary.find(e => e.langue === to && normalize(e.traduction) === normFr);
            const frenchLabel = sample?.traduction ?? query;
            for (const expr of targets) {
                results.push({ expression: query, frenchPivot: frenchLabel, cible: expr, langue: to, score });
            }
        }
        return results.sort((a, b) => b.score - a.score);
    }

    // ── Langue locale → Français ──────────────────────────────────────────────
    if (from !== 'Français' && to === 'Français') {
        const results: CrossResult[] = [];
        for (const entry of dictionary) {
            if (entry.langue !== from) continue;
            const score = matchScore(q, normalize(entry.expression));
            if (score > 0) {
                results.push({ expression: entry.expression, frenchPivot: entry.traduction, cible: entry.traduction, langue: 'Français', score });
            }
        }
        return results.sort((a, b) => b.score - a.score);
    }

    // ── Langue A → Langue B (via index français) ──────────────────────────────
    // Étape 1: trouver les traductions françaises normalisées du mot source
    const matchedFrKeys = new Map<string, { label: string; score: number }>();
    for (const entry of dictionary) {
        if (entry.langue !== from) continue;
        const score = matchScore(q, normalize(entry.expression));
        if (score > 0) {
            const normFr = normalize(entry.traduction);
            const prev = matchedFrKeys.get(normFr);
            if (!prev || score > prev.score) {
                matchedFrKeys.set(normFr, { label: entry.traduction, score });
            }
        }
    }
    if (matchedFrKeys.size === 0) return [];

    // Étape 2: utiliser l'index pour trouver directement les mots dans la langue cible
    const results: CrossResult[] = [];
    const seen = new Set<string>();
    for (const [normFr, { label: frenchLabel, score }] of matchedFrKeys) {
        const langMap = frenchIndex.get(normFr);
        if (!langMap) continue;
        const targets = langMap.get(to);
        if (!targets) continue;
        for (const expr of targets) {
            const key = normFr + '|' + expr;
            if (!seen.has(key)) {
                seen.add(key);
                results.push({ expression: query, frenchPivot: frenchLabel, cible: expr, langue: to, score });
            }
        }
    }
    return results.sort((a, b) => b.score - a.score);
}

// ─── Vocabulaire partagé entre deux langues ───────────────────────────────────
// Retourne tous les mots qui existent dans les deux langues (via pivot français).
export type SharedWord = {
    frenchMeaning: string;       // signification française commune
    sourceExpressions: string[]; // mots en langue source
    targetExpressions: string[]; // mots en langue cible
};

export function getSharedVocabulary(langA: LangueOrFr, langB: LangueOrFr): SharedWord[] {
    if (langA === langB || langA === 'Français' || langB === 'Français') return [];
    const shared: SharedWord[] = [];
    for (const [normFr, langMap] of frenchIndex) {
        const sourceExprs = langMap.get(langA);
        const targetExprs = langMap.get(langB);
        if (sourceExprs && targetExprs) {
            // Trouver le label français non-normalisé
            const sample = dictionary.find(
                e => (e.langue === langA || e.langue === langB) && normalize(e.traduction) === normFr
            );
            shared.push({
                frenchMeaning: sample?.traduction ?? normFr,
                sourceExpressions: sourceExprs,
                targetExpressions: targetExprs,
            });
        }
    }
    return shared.sort((a, b) => a.frenchMeaning.localeCompare(b.frenchMeaning));
}
