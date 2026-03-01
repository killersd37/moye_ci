/**
 * imagematcher.mjs — image identification for "L'Œil de Moyé"
 *
 * Strategy (in order):
 *   1. SHA-256 exact match  → perfect for files uploaded directly from oeil moye folders
 *   2. aHash 16×16          → works for slightly re-saved / resized versions
 *      + margin check: best match must be at least MIN_MARGIN better than 2nd best
 *
 * Exports: loadReferenceImages(oeilMoyeDir), identifyImage(base64)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Jimp } from 'jimp';

// ── Site definitions ──────────────────────────────────────────────
const SITE_FOLDERS = [
    { slug: 'bete', folder: '1 er Masque Bété Gla', label: 'Masque Bété Gla' },
    { slug: 'baoule', folder: '2 e Masque Baoulé', label: 'Masque Baoulé' },
    { slug: 'dan-kagle', folder: '3 ème Masque Dan Kagle', label: 'Masque Dan Kagle' },
    { slug: 'dida', folder: 'Pagne Dida', label: 'Pagne Dida' },
    { slug: 'pont-liane', folder: 'Pont de liane', label: 'Pont de Liane' },
];

function getUrlForSlug(slug) {
    const site = SITE_FOLDERS.find(s => s.slug === slug);
    if (!site) return `/moye/${slug}/`;
    const encodedFolder = encodeURIComponent(site.folder);
    return `/oeil%20moye/${encodedFolder}/index.html`;
}

const HASH_SIZE = 16;    // 16×16 aHash (256 bits)
const MAX_DISTANCE = 0.38;  // max Hamming distance for a valid match
const MIN_MARGIN = 0.06;  // best match must be >= 6% better than 2nd best

// ── In-memory stores ──────────────────────────────────────────────
let sha256Store = new Map();  // sha256hex → { slug, label }
let hashStore = [];         // { slug, label, hash: Uint8Array }

// ── SHA-256 helper ────────────────────────────────────────────────
function sha256(buf) {
    return crypto.createHash('sha256').update(buf).digest('hex');
}

// ── aHash (average hash) ──────────────────────────────────────────
function computeAHash(img) {
    img.resize({ w: HASH_SIZE, h: HASH_SIZE });
    img.greyscale();

    const pixels = [];
    for (let y = 0; y < HASH_SIZE; y++) {
        for (let x = 0; x < HASH_SIZE; x++) {
            pixels.push((img.getPixelColor(x, y) >>> 24) & 0xff);
        }
    }
    const avg = pixels.reduce((a, b) => a + b, 0) / pixels.length;
    const bits = new Uint8Array(pixels.length);
    for (let i = 0; i < pixels.length; i++) bits[i] = pixels[i] >= avg ? 1 : 0;
    return bits;
}

function hammingDist(a, b) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    return diff / a.length;
}

// ── Load reference images at startup ──────────────────────────────
export async function loadReferenceImages(oeilMoyeDir) {
    sha256Store = new Map();
    hashStore = [];
    const ok = new Set(['.jpg', '.jpeg', '.png', '.webp', '.jfif']);

    for (const site of SITE_FOLDERS) {
        const siteDir = path.join(oeilMoyeDir, site.folder);
        if (!fs.existsSync(siteDir)) {
            console.warn(`[Matcher] Not found: ${siteDir}`);
            continue;
        }

        const files = fs.readdirSync(siteDir).filter(f => ok.has(path.extname(f).toLowerCase()));
        for (const file of files) {
            const filePath = path.join(siteDir, file);
            try {
                // SHA-256 fingerprint of raw file bytes
                const rawBuf = fs.readFileSync(filePath);
                sha256Store.set(sha256(rawBuf), { slug: site.slug, label: site.label });

                // aHash for perceptual matching
                const img = await Jimp.read(filePath);
                const hash = computeAHash(img);
                hashStore.push({ slug: site.slug, label: site.label, hash });

                console.log(`[Matcher] ✓ ${site.slug}/${file}`);
            } catch (e) {
                console.warn(`[Matcher] Skip ${file}: ${e.message}`);
            }
        }
    }
    console.log(`[Matcher] Ready — ${sha256Store.size} SHA-256 + ${hashStore.length} aHash fingerprints.`);
}

// ── Identify a base64 image ───────────────────────────────────────
export async function identifyImage(base64) {
    const buf = Buffer.from(base64, 'base64');

    // ── Pass 1: SHA-256 exact match ───────────────────────────────
    const exact = sha256Store.get(sha256(buf));
    if (exact) {
        console.log(`[Matcher] ✓ Exact SHA-256 → ${exact.slug}`);
        return { slug: exact.slug, label: exact.label, url: getUrlForSlug(exact.slug) };
    }

    // ── Pass 2: aHash with margin check ──────────────────────────
    if (hashStore.length === 0) return null;

    const img = await Jimp.read(buf);
    const hash = computeAHash(img);

    // Collect per-slug best distance (best image of each category)
    const slugBest = new Map(); // slug → min distance
    for (const e of hashStore) {
        const d = hammingDist(hash, e.hash);
        if (!slugBest.has(e.slug) || d < slugBest.get(e.slug)) {
            slugBest.set(e.slug, d);
        }
    }

    // Sort slugs by their best distance
    const ranked = [...slugBest.entries()].sort((a, b) => a[1] - b[1]);
    const [best, second] = ranked;

    const bestDist = best[1];
    const secondDist = ranked.length > 1 ? second[1] : 1;
    const margin = secondDist - bestDist;

    console.log(`[Matcher] aHash best="${best[0]}" dist=${bestDist.toFixed(3)}, 2nd="${second?.[0]}" dist=${secondDist.toFixed(3)}, margin=${margin.toFixed(3)}`);

    if (bestDist <= MAX_DISTANCE) {
        const slug = best[0];
        const entry = SITE_FOLDERS.find(s => s.slug === slug);
        return { slug, label: entry?.label ?? slug, url: getUrlForSlug(slug) };
    }

    return null;
}
