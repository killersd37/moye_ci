import React, { createContext, useContext, useState } from 'react';

export type AppLanguage = 'fr' | 'en' | 'es';

const LANG_STORAGE_KEY = 'moye-lang';

function getStoredLang(): AppLanguage {
  if (typeof window === 'undefined') return 'fr';
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === 'en' || stored === 'es' || stored === 'fr') return stored;
  return 'fr';
}

/** Enregistre la langue et recharge toute la page pour appliquer la traduction partout. */
export function setLanguageAndReload(lang: AppLanguage): void {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  window.location.reload();
}

type TranslationEntry = {
  fr: string;
  en: string;
  es: string;
};

type Translations = Record<string, TranslationEntry>;

const translations: Translations = {
  'nav.home': {
    fr: 'Accueil',
    en: 'Home',
    es: 'Inicio',
  },
  'nav.culture': {
    fr: 'Culture',
    en: 'Culture',
    es: 'Cultura',
  },
  'nav.wonders': {
    fr: 'Merveilles',
    en: 'Wonders',
    es: 'Maravillas',
  },
  'nav.scanner': {
    fr: 'Scanner',
    en: 'Scanner',
    es: 'Escáner',
  },
  'nav.translator': {
    fr: 'Traducteur',
    en: 'Translator',
    es: 'Traductor',
  },
  'nav.voice': {
    fr: 'Voix',
    en: 'Voice',
    es: 'Voz',
  },
  'nav.learn': {
    fr: 'Académie',
    en: 'Academy',
    es: 'Academia',
  },
  'landing.subtitle': {
    fr: "Côte d'Ivoire · Patrimoine & IA",
    en: "Côte d'Ivoire · Heritage & AI",
    es: 'Costa de Marfil · Patrimonio e IA',
  },
  'landing.tagline': {
    fr: 'Akwaba en Côte d’Ivoire !',
    en: 'Welcome to Côte d’Ivoire!',
    es: '¡Bienvenido a Costa de Marfil!',
  },
  'lang.site': { fr: 'Langue du site', en: 'Site language', es: 'Idioma del sitio' },
  'lang.active': { fr: 'Actif', en: 'Active', es: 'Activo' },
  'home.hero': { fr: "Je suis Moyé, le pont numérique qui sauvegarde et perpétue l'héritage culturel ivoirien.", en: "I am Moyé, the digital bridge that preserves and perpetuates Ivorian cultural heritage.", es: "Soy Moyé, el puente digital que preserva y perpetúa el patrimonio cultural marfileño." },
  'home.subtitle': { fr: "Côte d'Ivoire · Patrimoine & IA", en: "Côte d'Ivoire · Heritage & AI", es: 'Costa de Marfil · Patrimonio e IA' },
  'home.modules': { fr: 'Modules', en: 'Modules', es: 'Módulos' },
  'home.ethnies.title': { fr: '60+ Ethnies', en: '60+ Ethnic groups', es: '60+ Etnias' },
  'home.ethnies.desc': { fr: "Explorez la richesse et la diversité de nos 60+ communautés ethniques ivoiriennes, chacune avec ses traditions uniques.", en: "Explore the richness and diversity of our 60+ Ivorian ethnic communities, each with its unique traditions.", es: "Explora la riqueza y diversidad de nuestras 60+ comunidades étnicas marfileñas, cada una con sus tradiciones únicas." },
  'home.langues.title': { fr: '70+ Langues', en: '70+ Languages', es: '70+ Idiomas' },
  'home.langues.desc': { fr: "Nos voix, notre identité. Découvrez et apprenez les langues qui font l'âme de la Côte d'Ivoire.", en: "Our voices, our identity. Discover and learn the languages that make up the soul of Côte d'Ivoire.", es: "Nuestras voces, nuestra identidad. Descubre y aprende las lenguas que forman el alma de Costa de Marfil." },
  'home.academie.title': { fr: "L'Académie", en: 'The Academy', es: 'La Academia' },
  'home.academie.desc': { fr: "Un espace de transmission : apprenez nos langues locales avec des cours guidés par l'IA, à votre rythme.", en: "A space for passing on knowledge: learn our local languages with AI-guided courses, at your own pace.", es: "Un espacio de transmisión: aprende nuestras lenguas locales con cursos guiados por IA, a tu ritmo." },
  'home.patrimoine.title': { fr: 'Patrimoine & IA', en: 'Heritage & AI', es: 'Patrimonio e IA' },
  'home.patrimoine.desc': { fr: "La technologie au service du passé. L'IA analyse, indexe et préserve notre patrimoine culturel immatériel.", en: "Technology at the service of the past. AI analyzes, indexes and preserves our intangible cultural heritage.", es: "La tecnología al servicio del pasado. La IA analiza, indexa y preserva nuestro patrimonio cultural inmaterial." },
  'home.musee.title': { fr: 'Musée Virtuel', en: 'Virtual Museum', es: 'Museo Virtual' },
  'home.musee.desc': { fr: "L'IA décrypte nos masques sacrés, pagnes et œuvres d'art. Un musée accessible à tous, partout dans le monde.", en: "AI deciphers our sacred masks, fabrics and works of art. A museum accessible to all, worldwide.", es: "La IA descifra nuestras máscaras sagradas, telas y obras de arte. Un museo accesible para todos, en todo el mundo." },
  'home.sites.title': { fr: 'Sites Touristiques', en: 'Tourist Sites', es: 'Sitios Turísticos' },
  'home.sites.desc': { fr: "Découvrez les trésors naturels et historiques de nos régions : parcs, cascades, sites classés UNESCO.", en: "Discover the natural and historical treasures of our regions: parks, waterfalls, UNESCO-listed sites.", es: "Descubre los tesoros naturales e históricos de nuestras regiones: parques, cascadas, sitios UNESCO." },
  'home.agenda.title': { fr: 'Agenda & Événements', en: 'Agenda & Events', es: 'Agenda y Eventos' },
  'home.agenda.desc': { fr: "Un calendrier qui alerte l'utilisateur sur les fêtes culturelles, cérémonies et événements traditionnels ivoiriens.", en: "A calendar that alerts users to cultural festivals, ceremonies and traditional Ivorian events.", es: "Un calendario que alerta al usuario sobre festivales culturales, ceremonias y eventos tradicionales marfileños." },
  'home.missions': { fr: 'MISSIONS', en: 'MISSIONS', es: 'MISIONES' },
  'home.mission1': { fr: "Numériser le Savoir : Créer une archive numérique inaltérable de nos 60+ ethnies et 70+ langues pour contrer l'oubli.", en: "Digitize Knowledge: Create an enduring digital archive of our 60+ ethnic groups and 70+ languages to counter oblivion.", es: "Digitalizar el saber: crear un archivo digital perdurable de nuestras 60+ etnias y 70+ lenguas para contrarrestar el olvido." },
  'home.mission2': { fr: "Éduquer par l'Innovation : Rendre l'apprentissage de nos racines interactif et accessible à toute la jeunesse ivoirienne grâce à l'IA.", en: "Educate through Innovation: Make learning our roots interactive and accessible to all Ivorian youth through AI.", es: "Educar con innovación: hacer el aprendizaje de nuestras raíces interactivo y accesible a toda la juventud marfileña gracias a la IA." },
  'home.mission3': { fr: "Rayonner à l'International : Propulser la richesse de notre patrimoine sur la scène mondiale en synergie avec le Ministère de la Culture.", en: "Shine Internationally: Propel our heritage wealth onto the world stage in synergy with the Ministry of Culture.", es: "Brillar a nivel internacional: impulsar la riqueza de nuestro patrimonio en el escenario mundial en sinergia con el Ministerio de Cultura." },
  'home.footer': { fr: "République de Côte d'Ivoire · Ministère de la Culture", en: "Republic of Côte d'Ivoire · Ministry of Culture", es: "República de Costa de Marfil · Ministerio de Cultura" },
  'home.signature': { fr: "ensemble, gardons nos traditions vivantes et propulsons notre patrimoine vers l'avenir.", en: "together, let's keep our traditions alive and propel our heritage into the future.", es: "juntos, mantengamos vivas nuestras tradiciones e impulsemos nuestro patrimonio hacia el futuro." },
  'translator.title': { fr: 'Traducteur', en: 'Translator', es: 'Traductor' },
  'translator.subtitle': { fr: 'La langue est le véhicule de notre culture.', en: 'Language is the vehicle of our culture.', es: 'La lengua es el vehículo de nuestra cultura.' },
  'translator.langs': { fr: 'Français ↔ Baoulé · Dioula · Bété · Sénoufo', en: 'French ↔ Baoulé · Dioula · Bété · Sénoufo', es: 'Francés ↔ Baoulé · Dioula · Bété · Sénoufo' },
  'voice.title': { fr: 'La Voix du Terroir', en: 'The Voice of the Land', es: 'La Voz del Terruño' },
  'voice.subtitle': { fr: "L'IA qui parle votre langue maternelle.", en: "AI that speaks your mother tongue.", es: "IA que habla tu lengua materna." },
  'voice.talk': { fr: 'Parler à Moyé', en: 'Talk to Moyé', es: 'Hablar con Moyé' },
  'voice.talk.desc': { fr: "Posez vos questions oralement en Baoulé, Dioula, Bété ou Sénoufo. Moyé comprend et répond.", en: "Ask your questions orally in Baoulé, Dioula, Bété or Sénoufo. Moyé understands and responds.", es: "Haz tus preguntas oralmente en Baoulé, Dioula, Bété o Sénoufo. Moyé entiende y responde." },
  'voice.mic': { fr: 'Activer le micro', en: 'Enable microphone', es: 'Activar el micrófono' },
  'voice.news': { fr: 'Écouter les Nouvelles', en: 'Listen to the News', es: 'Escuchar las Noticias' },
  'voice.news.desc': { fr: "Informations importantes lues par l'IA dans votre langue locale.", en: "Important information read by AI in your local language.", es: "Información importante leída por la IA en tu idioma local." },
  'voice.news.btn': { fr: 'Écouter maintenant', en: 'Listen now', es: 'Escuchar ahora' },
  'voice.capabilities': { fr: 'Capacités', en: 'Capabilities', es: 'Capacidades' },
  'voice.cap1': { fr: 'Reconnaissance vocale multilingue', en: 'Multilingual voice recognition', es: 'Reconocimiento de voz multilingüe' },
  'voice.cap2': { fr: 'Traduction instantanée', en: 'Instant translation', es: 'Traducción instantánea' },
  'voice.cap3': { fr: 'Prononciation native', en: 'Native pronunciation', es: 'Pronunciación nativa' },
  'voice.cap4': { fr: 'Mode hors-ligne (bientôt)', en: 'Offline mode (coming soon)', es: 'Modo sin conexión (próximamente)' },
  'voice.quote': { fr: '"Une technologie inclusive pour que personne ne soit laissé de côté."', en: '"Inclusive technology so no one is left behind."', es: '"Tecnología inclusiva para que nadie quede atrás."' },
  'wonders.title': { fr: 'Merveilles Touristiques', en: 'Tourist Wonders', es: 'Maravillas Turísticas' },
  'wonders.subtitle': { fr: "Trésors naturels et historiques de Côte d'Ivoire.", en: "Natural and historical treasures of Côte d'Ivoire.", es: "Tesoros naturales e históricos de Costa de Marfil." },
  'wonders.search': { fr: 'Rechercher un site, une région...', en: 'Search for a site, region...', es: 'Buscar un sitio, una región...' },
  'wonders.discover': { fr: 'Découvrir', en: 'Discover', es: 'Descubrir' },
  'wonders.noResult': { fr: 'Aucun sanctuaire trouvé pour cette recherche.', en: 'No sanctuary found for this search.', es: 'Ningún santuario encontrado para esta búsqueda.' },
  'learn.title': { fr: "L'Académie", en: 'The Academy', es: 'La Academia' },
  'learn.subtitle': { fr: 'Un espace de transmission.', en: 'A space for passing on knowledge.', es: 'Un espacio de transmisión.' },
  'learn.name': { fr: 'Votre nom', en: 'Your name', es: 'Tu nombre' },
  'learn.pin': { fr: 'Clé secrète (4 chiffres)', en: 'Secret key (4 digits)', es: 'Clave secreta (4 dígitos)' },
  'learn.enter': { fr: 'Entrer', en: 'Enter', es: 'Entrar' },
  'close': { fr: 'Fermer', en: 'Close', es: 'Cerrar' },
  'oeil.title': { fr: "L'Œil de Moyé", en: "Moyé's Eye", es: "El Ojo de Moyé" },
};

type LanguageContextValue = {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  setLanguageAndReload: (lang: AppLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<AppLanguage>(getStoredLang);

  const setLanguageAndReloadFn = (newLang: AppLanguage) => {
    setLanguageAndReload(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, setLanguageAndReload: setLanguageAndReloadFn }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function t(key: keyof typeof translations, lang: AppLanguage): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry.fr;
}

