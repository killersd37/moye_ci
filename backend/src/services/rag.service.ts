/*
 * RAG context builder for La Lumière Moyé. Uses Prisma for ETHNIE, LANGUE, ACADEMIE.
 * SITE_TOURISTIQUE: TODO when Prisma model exists — add findMany and include here.
 * SCALABILITY: Increase MAX_* constants or add keyword filtering for 60+ ethnies.
 * FUTURE EMBEDDINGS: Replace broad findMany with vector similarity search (e.g. pgvector) for large corpora.
 */
import { prisma } from '../utils/prisma';
import { buildFullPrompt, MOYE_SYSTEM_PROMPT } from '../prompts/system.prompt';

const MAX_ETHNIES = 50;
const MAX_LANGUES = 30;
const MAX_LEÇONS = 20;
const CONTEXT_MAX_CHARS = 12000;

export async function buildContextFromQuery(query: string): Promise<string> {
  const normalized = query.toLowerCase().trim();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  let ethniesPart: string;
  let languesPart: string;
  let academiePart: string;
  let sitesPart: string;

  try {
    [ethniesPart, languesPart, academiePart, sitesPart] = await Promise.all([
      getEthniesContext(tokens),
      getLanguesContext(tokens),
      getAcademieContext(tokens),
      getSitesTouristiquesContext(tokens),
    ]);
  } catch (e) {
    return '(Base de données indisponible. Démarrez PostgreSQL sur localhost:5432 pour charger le contexte culturel. Ex: Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=moye postgres:16)';
  }

  const sections: string[] = [];
  if (ethniesPart) sections.push(`## ETHNIES\n${ethniesPart}`);
  if (languesPart) sections.push(`## LANGUES\n${languesPart}`);
  if (academiePart) sections.push(`## ACADÉMIE\n${academiePart}`);
  if (sitesPart) sections.push(`## SITES TOURISTIQUES\n${sitesPart}`);

  let out = sections.join('\n\n');
  if (out.length > CONTEXT_MAX_CHARS) {
    out = out.slice(0, CONTEXT_MAX_CHARS) + '\n[... contexte tronqué ...]';
  }
  return out || '(Aucun contenu pertinent trouvé dans la base pour cette question.)';
}

const QUICK_RESPONSE_MAX = 1400;

export function formatQuickResponse(context: string): string {
  if (context.startsWith('(Base de données') || context.startsWith('(Aucun contenu')) {
    return context;
  }
  const intro = 'D\'après le patrimoine MOYÉ :\n\n';
  const cleaned = context.replace(/##\s+/g, '\n• ').replace(/\n---\n/g, '\n\n');
  const truncated = cleaned.length <= QUICK_RESPONSE_MAX
    ? cleaned
    : cleaned.slice(0, QUICK_RESPONSE_MAX) + '\n\n[…]';
  return intro + truncated.trim();
}

async function getEthniesContext(tokens: string[]): Promise<string> {
  const ethnies = await prisma.ethnie.findMany({
    take: MAX_ETHNIES,
    include: {
      region: { select: { nom: true } },
      histoires: { take: 3, select: { titre: true, contenu: true, periode: true } },
      rites: { take: 5, select: { nom: true, description: true } },
      gastronomies: { take: 5, select: { nom: true, description: true } },
      fetes: { take: 3, select: { nom: true, description: true, periode: true } },
    },
    orderBy: { nom: 'asc' },
  });

  const blocks: string[] = [];
  for (const e of ethnies) {
    const parts: string[] = [
      `Ethnie: ${e.nom}`,
      `Région: ${e.region.nom}`,
      e.description ? `Description: ${e.description}` : '',
      e.groupeLinguistique ? `Groupe linguistique: ${e.groupeLinguistique}` : '',
      e.origines ? `Origines: ${e.origines}` : '',
    ];
    if (e.histoires.length) {
      parts.push('Histoires: ' + e.histoires.map(h => `${h.titre} (${h.periode || 'N/A'}): ${h.contenu.slice(0, 300)}`).join(' | '));
    }
    if (e.rites.length) {
      parts.push('Rites: ' + e.rites.map(r => `${r.nom}: ${r.description.slice(0, 200)}`).join(' | '));
    }
    if (e.gastronomies.length) {
      parts.push('Gastronomie: ' + e.gastronomies.map(g => `${g.nom}: ${g.description.slice(0, 150)}`).join(' | '));
    }
    if (e.fetes.length) {
      parts.push('Fêtes: ' + e.fetes.map(f => `${f.nom} (${f.periode || 'N/A'}): ${f.description.slice(0, 150)}`).join(' | '));
    }
    blocks.push(parts.filter(Boolean).join('\n'));
  }
  return blocks.join('\n---\n');
}

async function getLanguesContext(tokens: string[]): Promise<string> {
  const langues = await prisma.langue.findMany({
    take: MAX_LANGUES,
    include: { mots: { take: 20, select: { mot: true, phonetique: true, categorie: true } } },
    orderBy: { nom: 'asc' },
    where: { isActive: true },
  });

  const blocks: string[] = [];
  for (const l of langues) {
    const parts: string[] = [
      `Langue: ${l.nom} (code: ${l.code})`,
      l.nomLocal ? `Nom local: ${l.nomLocal}` : '',
      l.famille ? `Famille: ${l.famille}` : '',
    ];
    if (l.mots.length) {
      parts.push('Mots: ' + l.mots.map(m => `${m.mot}${m.phonetique ? ` [${m.phonetique}]` : ''} (${m.categorie || 'N/A'})`).join(', '));
    }
    blocks.push(parts.filter(Boolean).join('\n'));
  }
  return blocks.join('\n---\n');
}

async function getAcademieContext(tokens: string[]): Promise<string> {
  const niveaux = await prisma.niveau.findMany({
    orderBy: { ordre: 'asc' },
    include: {
      lecons: {
        take: MAX_LEÇONS,
        orderBy: { ordre: 'asc' },
        where: { isActive: true },
        select: { titre: true, description: true, contenu: true, pointsGain: true, dureeMin: true },
      },
    },
  });

  const blocks: string[] = [];
  for (const n of niveaux) {
    blocks.push(`Niveau: ${n.nom} (${n.type})\n${n.description || ''}\nLeçons: ${n.lecons.map(l => `${l.titre}: ${(l.contenu || l.description || '').slice(0, 250)}`).join(' | ')}`);
  }
  return blocks.join('\n---\n');
}

async function getSitesTouristiquesContext(_tokens: string[]): Promise<string> {
  return '';
}

export function buildPromptForOllama(context: string, question: string): string {
  return buildFullPrompt(MOYE_SYSTEM_PROMPT, context, question);
}
