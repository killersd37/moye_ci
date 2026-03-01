/**
 * Module de simulation locale du chatbot Moyé
 * Charge une base JSON de questions-réponses sur les ethnies ivoiriennes
 * et renvoie une réponse immédiate si une correspondance est trouvée.
 */

/** Entrée de la base de données locale (question / answer) */
export interface LocalQAEntry {
  question: string;
  answer: string;
}

/** Résultat de la recherche locale */
export type LocalSearchResult =
  | { found: true; answer: string }
  | { found: false };

/** Message suggéré quand aucune correspondance n'est trouvée (basculer sur Ollama) */
export const NO_MATCH_SUGGESTION =
  "Je n'ai pas cette réponse localement. Voulez-vous basculer sur le modèle Ollama pour une réponse plus détaillée ?";

/** Cache de la base chargée (éviter de recharger à chaque requête) */
let cachedDB: LocalQAEntry[] | null = null;

/** URL de la base : toujours relative à l’origine de l’app (fonctionne après redémarrage serveur) */
const LOCAL_QA_URL =
  (typeof import.meta.env?.BASE_URL === 'string' ? import.meta.env.BASE_URL.replace(/\/$/, '') : '') +
  '/data/ethnies-qa.json';

const MAX_LOAD_RETRIES = 3;
const LOAD_RETRY_DELAY_MS = 800;

/**
 * Charge la base JSON des questions-réponses depuis /data/ethnies-qa.json.
 * Utilise un cache en mémoire après le premier chargement.
 * En cas d’échec (ex. serveur redémarré), réessaie jusqu’à MAX_LOAD_RETRIES fois sans garder d’état en cache.
 */
export async function loadLocalQA(): Promise<LocalQAEntry[]> {
  if (cachedDB && cachedDB.length > 0) return cachedDB;
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_LOAD_RETRIES; attempt++) {
    try {
      const res = await fetch(LOCAL_QA_URL, { cache: 'default' });
      if (!res.ok) throw new Error(`Base locale: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Format de base invalide.');
      const filtered = data.filter(
        (e: unknown): e is LocalQAEntry =>
          typeof e === 'object' &&
          e !== null &&
          typeof (e as LocalQAEntry).question === 'string' &&
          typeof (e as LocalQAEntry).answer === 'string'
      );
      cachedDB = filtered;
      return cachedDB;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_LOAD_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, LOAD_RETRY_DELAY_MS));
      }
    }
  }
  throw lastError ?? new Error('Impossible de charger la base locale.');
}

/** Délai de réflexion (en ms) avant d’afficher la réponse locale (ex. 10 secondes). */
export const REFLEXION_DELAY_MS = 10000;

/**
 * Normalise une chaîne pour la comparaison : minuscules, trim, suppression des accents,
 * unification des apostrophes/guillemets et suppression de la ponctuation finale.
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035']/g, "'") // unifier toutes les apostrophes
    .replace(/\s+/g, ' ')
    .replace(/[.?!,;:]+$/g, '') // enlever la ponctuation finale
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalisation « loose » : en plus de normalize(), supprime apostrophes et ponctuation
 * partout, pour matcher même si l’utilisateur omet les apostrophes ou ajoute des symboles.
 */
function normalizeLoose(s: string): string {
  return normalize(s)
    .replace(/['.?!,;:]/g, '')
    .replace(/\s+/g, ' ')
    // Une lettre seule + espace(s) + mot suivant = même forme qu'avec apostrophe (ex. "d ou" -> "dou")
    .replace(/\b([a-z])\s+([a-z]\w*)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Cherche une réponse locale pour la question de l'utilisateur.
 * - Correspondance exacte (après normalisation) sur la question de la base.
 * - Sinon : la question utilisateur contient la question de la base, ou l'inverse.
 * - Sinon : même logique avec normalisation « loose » (sans apostrophes ni ponctuation).
 * Priorité : correspondance exacte, puis question base contenue dans user, puis user contenue dans question base, puis idem en loose.
 */
export async function findLocalAnswer(userQuestion: string): Promise<LocalSearchResult> {
  const db = await loadLocalQA();
  const normalizedUser = normalize(userQuestion);
  if (!normalizedUser) return { found: false };

  const looseUser = normalizeLoose(userQuestion);
  if (!looseUser) return { found: false };

  let result: LocalSearchResult = { found: false };

  // 1) Correspondance exacte (normalisée)
  for (const entry of db) {
    if (normalize(entry.question) === normalizedUser) {
      result = { found: true, answer: entry.answer };
      break;
    }
  }

  // 2) La question de la base est contenue dans la question utilisateur
  if (!result.found) {
    for (const entry of db) {
      const normalizedEntry = normalize(entry.question);
      if (normalizedUser.includes(normalizedEntry)) {
        result = { found: true, answer: entry.answer };
        break;
      }
    }
  }

  // 3) La question utilisateur est contenue dans une question de la base
  if (!result.found) {
    for (const entry of db) {
      const normalizedEntry = normalize(entry.question);
      if (normalizedEntry.includes(normalizedUser)) {
        result = { found: true, answer: entry.answer };
        break;
      }
    }
  }

  // 4) Correspondance exacte en « loose » (sans apostrophes, sans ponctuation)
  if (!result.found) {
    for (const entry of db) {
      if (normalizeLoose(entry.question) === looseUser) {
        result = { found: true, answer: entry.answer };
        break;
      }
    }
  }

  // 5) Contenu / contenu inverse en « loose »
  if (!result.found) {
    for (const entry of db) {
      const looseEntry = normalizeLoose(entry.question);
      if (looseUser.includes(looseEntry) || looseEntry.includes(looseUser)) {
        result = { found: true, answer: entry.answer };
        break;
      }
    }
  }

  if (result.found) {
    await new Promise((resolve) => setTimeout(resolve, REFLEXION_DELAY_MS));
  }
  return result;
}
