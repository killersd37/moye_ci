import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiModel = "gemini-2.5-flash-preview-04-17"; // vision model

export async function translateText(text: string, targetLang: string) {
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Translate the following text to ${targetLang}. Only return the translation: "${text}"`,
  });
  return response.text;
}

export async function analyzeImage(base64Image: string) {
  const response = await genAI.models.generateContent({
    model: aiModel,
    contents: {
      parts: [
        { text: "Identify the Ivorian ethnic group or cultural object in this image (e.g., Baoulé mask, Kente/Kita cloth, Senoufo statue). Return only the name of the ethnic group or object." },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    }
  });
  return response.text ?? '';
}

/**
 * Classifies an image against the 5 known "Oeil de Moyé" cultural objects.
 * Returns one of: 'bete' | 'baoule' | 'dan-kagle' | 'dida' | 'pont-liane' | 'none'
 */
export async function classifyOeilMoye(base64Image: string): Promise<string> {
  const prompt = `You are an AI recognizing Ivorian cultural objects for the MOYÉ platform.
Look at this image and decide which ONE of the following 5 cultural objects it shows.
Return ONLY the slug word for the matched object, or 'none' if it matches nothing.

Categories and their slugs:
- Masque Bété Gla (war/justice mask of the Bété people, segmented face, kaolin, metal nails) → slug: bete
- Masque Baoulé (sacred mask of the Baoulé people, Ivory Coast) → slug: baoule
- Masque Dan Kagle / Tankagle (mask of the Dan / Yacouba people) → slug: dan-kagle
- Pagne Dida (traditional woven cloth / pagne of the Dida people) → slug: dida
- Pont de liane (traditional suspension bridge made of lianas, Man region) → slug: pont-liane

Respond with ONLY one word: bete, baoule, dan-kagle, dida, pont-liane, or none.`;

  const response = await genAI.models.generateContent({
    model: aiModel,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    }
  });

  const raw = (response.text ?? '').trim().toLowerCase().replace(/[^a-z-]/g, '');
  const valid = ['bete', 'baoule', 'dan-kagle', 'dida', 'pont-liane'];
  return valid.includes(raw) ? raw : 'none';
}
