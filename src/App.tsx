import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Globe, Languages, Mic, GraduationCap,
  Map as MapIcon, Camera, Play, Search, Lock,
  User, ExternalLink, ChevronRight, Sparkles,
  BookOpen, Star, ArrowRight, X as CloseIcon,
} from 'lucide-react';
import { cn } from './lib/utils';
import { AIScanner } from './components/AIScanner';
import { Translator } from './components/Translator';
import { EthnieList } from './components/EthnieList';
import Academy from './components/Academy';
import { MoyéAssistant } from './components/MoyéAssistant/MoyéAssistant';
import { useLanguage, t } from './lib/i18n';

type Tab = 'home' | 'culture' | 'wonders' | 'scanner' | 'translator' | 'voice' | 'learn';

// ─────────────────────────────────────────────────────────────
// LANDING SCREEN  — immersive dark cultural hero
// ─────────────────────────────────────────────────────────────
const LandingScreen = ({ onStart }: { onStart: () => void }) => {
  const { lang } = useLanguage();
  return (
  <div
    className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
    style={{
      background:
        'linear-gradient(160deg, #F5E6C8 0%, #F0D9A8 20%, #EDD28F 45%, #F2C87A 70%, #E8BB6A 100%), ' +
        'radial-gradient(circle at 20% 30%, rgba(212,135,11,0.12) 0%, transparent 40%), ' +
        'radial-gradient(circle at 80% 70%, rgba(184,120,42,0.15) 0%, transparent 50%), ' +
        'radial-gradient(circle at 10% 90%, rgba(200,150,12,0.08) 0%, transparent 60%)',
      backgroundAttachment: 'fixed',
    }}
  >
    {/* Animated grid background */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(160,110,0,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(160,110,0,0.18) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
    </div>

    {/* Accent orbs */}
    <div className="absolute top-10 right-16 w-72 h-72 rounded-full opacity-10" style={{
      background: 'radial-gradient(circle, #C8960C 0%, transparent 70%)',
      filter: 'blur(40px)'
    }} />
    <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-8" style={{
      background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
      filter: 'blur(50px)'
    }} />

    {/* Traditional frame overlay */}
    <div className="kita-frame opacity-30" />
    {/* Dot texture */}
    <div className="absolute inset-0 dot-texture opacity-30 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center justify-between flex-1 py-8 md:py-12 lg:py-16 px-4 sm:px-6">
      {/* Brand mark with glow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 mt-2 md:mt-4"
      >
        <p className="text-[#C8960C] font-inter text-[10px] sm:text-[12px] uppercase tracking-[0.35em] md:tracking-[0.4em] font-semibold drop-shadow-lg">
          {t('landing.subtitle', lang)}
        </p>
        <div className="relative inline-block">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-philosopher font-bold tracking-tight leading-none drop-shadow-md"
            style={{
              color: '#1A1008',
              textShadow: '0 2px 12px rgba(200,150,12,0.25), 0 1px 4px rgba(0,0,0,0.15)'
            }}>
            Moyé
          </h1>
          <div className="absolute -bottom-2 md:-bottom-3 left-1/2 transform -translate-x-1/2 h-1 w-24 md:w-32 rounded-full" style={{
            background: 'linear-gradient(90deg, transparent 0%, #C8960C 50%, transparent 100%)'
          }} />
        </div>
      </motion.div>

      {/* Hero center */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 md:gap-8 max-w-xs sm:max-w-sm text-center"
      >
        {/* Logo ring with enhanced glow */}
        <div className="relative flex items-center justify-center mt-2 md:mt-4">
          {/* Outer animated ring */}
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-2 border-[#C8960C]/30 animate-pulse" style={{
            boxShadow: '0 0 30px rgba(200,150,12,0.3), inset 0 0 30px rgba(200,150,12,0.1)'
          }} />
          {/* Middle ring */}
          <div className="absolute w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full border border-[#10B981]/20" style={{
            boxShadow: '0 0 20px rgba(16,185,129,0.2)'
          }} />
          {/* Logo container */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[#C8960C]/40 shadow-2xl" style={{
            boxShadow: '0 0 40px rgba(200,150,12,0.4), 0 8px 32px rgba(0,0,0,0.6)'
          }}>
            <img
              src="/logo.jpeg"
              alt="Moyé"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-4 pt-4 md:pt-6">
          <p className="font-playfair italic text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-sm px-2" style={{ color: '#131212ff' }}>
            {t('landing.tagline', lang)}
          </p>
        </div>

        {/* Ticker */}
        <div className="overflow-hidden w-[120%] -ml-[10%] mt-2 md:mt-4 opacity-100">
          <div className="flex animate-marquee gap-6 md:gap-8 text-[#000000] text-[10px] sm:text-[11px] font-inter uppercase tracking-[0.18em] md:tracking-[0.2em] whitespace-nowrap font-bold">
            {['Baoulé', 'Dioula', 'Sénoufo', 'Bété', 'Agni', 'Wobé', 'Dan', 'Guéré', 'Baoulé', 'Dioula', 'Sénoufo', 'Bété', 'Agni', 'Wobé', 'Dan', 'Guéré', 'Ebrié'].map((e, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>{e}</span>
                <span className="w-1 h-1 rounded-full bg-[#0d0d0c]/50"></span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs sm:max-w-sm space-y-4 md:space-y-6 px-2"
      >
        <div className="h-px w-full" style={{
          background: 'linear-gradient(90deg, transparent 0%, #000000ff 50%, transparent 100%)'
        }} />
        <button
          onClick={onStart}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-full font-inter font-medium text-[14px] sm:text-[15px] relative overflow-hidden transition-all active:scale-[0.98] group"
          style={{
            background: 'linear-gradient(135deg, #8B6914 0%, #A07820 50%, #7A5C10 100%)',
            color: '#FDF3DC',
            boxShadow: '0 8px 28px rgba(120,90,10,0.35), 0 4px 12px rgba(0,0,0,0.18)'
          }}
        >
          <span className="relative z-10 flex items-center justify-between w-full">
            <span>Commencer l'exploration</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
            background: 'linear-gradient(135deg, #9E7A1A 0%, #B8901E 100%)'
          }} />
        </button>
        <p className="font-playfair italic text-sm text-center pb-4" style={{ color: '#8B6914' }}>
          Ensemble, gardons nos traditions vivantes.
        </p>
      </motion.div>
    </div>
  </div>
);
};

// ─────────────────────────────────────────────────────────────
// HOME VIEW
// ─────────────────────────────────────────────────────────────

const MODULE_CONFIG = [
  { image: "/image/Image acceuil/60+ Ethnies.jpg", titleKey: 'home.ethnies.title' as const, descKey: 'home.ethnies.desc' as const },
  { image: "/image/Image acceuil/70+ Langues.png", titleKey: 'home.langues.title' as const, descKey: 'home.langues.desc' as const },
  { image: "/image/Image acceuil/L'Académie.jpg", titleKey: 'home.academie.title' as const, descKey: 'home.academie.desc' as const },
  { image: "/image/Image acceuil/Patrimoine IA.png", titleKey: 'home.patrimoine.title' as const, descKey: 'home.patrimoine.desc' as const },
  { image: "/image/Image acceuil/oeuvre_art.webp", titleKey: 'home.musee.title' as const, descKey: 'home.musee.desc' as const },
  { image: "/image/Image acceuil/Sites Touristique.webp", titleKey: 'home.sites.title' as const, descKey: 'home.sites.desc' as const },
  { image: "/image/Image acceuil/Événements.jpg", titleKey: 'home.agenda.title' as const, descKey: 'home.agenda.desc' as const },
];

const HomeView = () => {
  const { lang } = useLanguage();
  return (
    <div
      className="min-h-screen pb-32 relative"
      style={{
        background:
          'linear-gradient(160deg, #F5E6C8 0%, #EDD28F 35%, #E2C070 60%, #D4AC58 80%, #C89840 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dot texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(120,80,0,0.07) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div className="relative z-10 max-w-xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 sm:space-y-10">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0" style={{ borderColor: 'rgba(120,80,0,0.3)' }}>
              <img src="/logo.jpeg" alt="Moyé" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-philosopher font-bold leading-none" style={{ color: '#1A1008' }}>
              Moyé
            </h1>
          </div>
          <div className="mx-auto h-0.5 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #8B6914, transparent)' }} />
          <p className="font-inter text-[11px] uppercase tracking-[0.35em] font-semibold" style={{ color: 'rgba(80,50,0,0.6)' }}>
            {t('home.subtitle', lang)}
          </p>

          <p className="font-inter text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'rgba(60,35,5,0.75)' }}>
            {t('home.hero', lang)}
          </p>
        </motion.div>

        {/* ── SECTION LABEL ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(120,80,0,0.25)' }} />
          <p className="font-inter text-[10px] uppercase tracking-[0.35em] font-bold" style={{ color: 'rgba(80,50,0,0.6)' }}>{t('home.modules', lang)}</p>
          <div className="flex-1 h-px" style={{ background: 'rgba(120,80,0,0.25)' }} />
        </motion.div>

        {/* ── CARDS GRID 2 COL → 3 COL LG ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {MODULE_CONFIG.map((mod, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 4px 20px rgba(100,65,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(180,130,40,0.18)',
              }}
            >
              {/* Image banner */}
              <div className="h-20 sm:h-24 overflow-hidden relative">
                <img
                  src={mod.image}
                  alt={t(mod.titleKey, lang)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(245,230,200,0.3), transparent)' }} />
              </div>
              {/* Content */}
              <div className="p-2.5 sm:p-3 flex flex-col gap-1 flex-1">
                <h3 className="font-philosopher font-bold text-[12px] sm:text-[14px] leading-snug" style={{ color: '#228B22' }}>{t(mod.titleKey, lang)}</h3>
                <p className="font-inter text-[9px] sm:text-[10px] leading-relaxed line-clamp-2" style={{ color: '#555' }}>{t(mod.descKey, lang)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CITATION ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-2 space-y-2">
          <div className="mx-auto h-px w-20" style={{ background: 'rgba(120,80,0,0.2)' }} />


          <div className="mx-auto h-px w-20" style={{ background: 'rgba(120,80,0,0.2)' }} />
        </motion.div>

        {/* ── BLOC INSTITUTIONNEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center space-y-3"
          style={{
            background: 'linear-gradient(135deg, rgba(80,50,0,0.55) 0%, rgba(120,80,10,0.65) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200,160,60,0.3)',
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
              <img src="/logo.jpeg" alt="Moyé" className="w-full h-full object-cover" />
            </div>
            <p className="font-inter text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: 'rgba(255,220,140,0.8)' }}>{t('home.missions', lang)}</p>
          </div>
          <div className="font-playfair italic text-base leading-relaxed space-y-4 text-left px-4" style={{ color: '#FDF3DC' }}>
            <p>- {t('home.mission1', lang)}</p>
            <p>- {t('home.mission2', lang)}</p>
            <p>- {t('home.mission3', lang)}</p>
          </div>
          <div className="mx-auto h-px w-12" style={{ background: 'rgba(200,160,60,0.4)' }} />
          <p className="font-inter text-[11px]" style={{ color: 'rgba(253,243,220,0.65)' }}>{t('home.footer', lang)}</p>
        </motion.div>

        {/* ── SIGNATURE ── */}
        <p className="text-center font-inter text-[10px] sm:text-[11px] pb-6 sm:pb-4" style={{ color: 'rgba(255, 255, 255, 0.97)' }}>
          {t('home.signature', lang)}
        </p>

      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DISCOVER VIEW
// ─────────────────────────────────────────────────────────────
const DiscoverView = ({ initialSearch }: { initialSearch?: string }) => (
  <div className="max-w-5xl lg:max-w-6xl mx-auto pb-24 sm:pb-28">
    <EthnieList initialSearch={initialSearch} />
  </div>
);

// ─────────────────────────────────────────────────────────────
// TRANSLATOR VIEW
// ─────────────────────────────────────────────────────────────
const TranslatorView = () => {
  const { lang } = useLanguage();
  return (
  <div className="max-w-2xl lg:max-w-3xl mx-auto pb-24 sm:pb-28 space-y-6 px-0">
    <div className="space-y-2 mb-6 sm:mb-8">
      <div className="trame-divider w-16" />
      <h2 className="text-3xl sm:text-4xl font-philosopher font-bold text-[#111111]">{t('translator.title', lang)}</h2>
      <p className="font-playfair italic text-[#9C6644] text-base sm:text-lg">
        {t('translator.subtitle', lang)}
      </p>
      <p className="font-inter text-[#111111]/60 text-xs sm:text-sm">
        {t('translator.langs', lang)}
      </p>
    </div>
    <Translator />
  </div>
  );
};

// ─────────────────────────────────────────────────────────────
// VOICE VIEW
// ─────────────────────────────────────────────────────────────
const VOICE_CAP_KEYS = ['voice.cap1', 'voice.cap2', 'voice.cap3', 'voice.cap4'] as const;
const VoiceView = () => {
  const { lang } = useLanguage();
  return (
  <div className="max-w-xl lg:max-w-2xl mx-auto pb-24 sm:pb-28 space-y-6">
    <div className="space-y-2 mb-6 sm:mb-8">
      <div className="trame-divider w-16" />
      <h2 className="text-3xl sm:text-4xl font-philosopher font-bold text-[#111111]">{t('voice.title', lang)}</h2>
      <p className="font-playfair italic text-[#9C6644] text-base sm:text-lg">{t('voice.subtitle', lang)}</p>
    </div>

    {/* Big mic card */}
    <div
      className="relative rounded-sm overflow-hidden p-6 sm:p-8 space-y-6"
      style={{
        background: 'linear-gradient(145deg, #1B4332 0%, #111111 100%)',
      }}
    >
      <div className="dot-texture absolute inset-0 opacity-10" />
      <div className="relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-sm flex items-center justify-center border border-[#9C6644]/30" style={{ background: '#111111' }}>
          <Mic size={28} className="text-[#F5EFE6]" />
        </div>
        <div>
          <h3 className="font-philosopher font-bold text-3xl text-[#F5EFE6]">{t('voice.talk', lang)}</h3>
          <p className="font-inter text-[#F5EFE6]/70 text-[15px] mt-2 leading-relaxed max-w-sm">
            {t('voice.talk.desc', lang)}
          </p>
        </div>
        <div className="trame-divider w-full opacity-20" />
        <button className="px-8 py-3.5 rounded-full font-inter font-medium text-[13px] text-[#111111] uppercase tracking-wider transition-all hover:bg-[#F5EFE6] hover:scale-[1.02] active:scale-[0.98] mt-2 shadow-lg"
          style={{ background: '#F77F00' }}>
          {t('voice.mic', lang)}
        </button>
      </div>
    </div>

    {/* News card */}
    <div className="card p-6 flex items-start gap-5">
      <div className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 bg-[#F5EFE6] border border-[#9C6644]/20">
        <Play size={18} className="text-[#1B4332] ml-1" />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-philosopher font-bold text-[#111111] text-lg">{t('voice.news', lang)}</h3>
        <p className="font-inter text-[#111111]/60 text-xs leading-relaxed">
          {t('voice.news.desc', lang)}
        </p>
        <button className="mt-3 font-inter text-[11px] font-semibold text-[#F77F00] uppercase tracking-wider hover:underline">
          {t('voice.news.btn', lang)}
        </button>
      </div>
    </div>

    {/* Capabilities */}
    <div className="card p-6 space-y-4">
      <p className="font-inter text-[10px] text-[#9C6644] font-nsemibold uppercase tracking-[0.2em]">{t('voice.capabilities', lang)}</p>
      {VOICE_CAP_KEYS.map((key, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-1 h-1 bg-[#1B4332] rounded-full flex-shrink-0" />
          <p className="font-inter text-[#111111]/70 text-sm">{t(key, lang)}</p>
        </div>
      ))}
    </div>

    <div className="text-center py-8">
      <div className="trame-divider w-24 mx-auto mb-6" />
      <p className="font-playfair italic text-xl text-[#111111]">
        {t('voice.quote', lang)}
      </p>
    </div>
  </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TOURISTIC WONDERS
// ─────────────────────────────────────────────────────────────
const TouristicWondersView = () => {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const sites = [
    { id: 1, name: "Cascade de Monogaga", desc: "L'une des plus belles cascades de Côte d'Ivoire, nichée au cœur de la forêt du Haut-Sassandra.", locality: "Haut-Sassandra, Oumé", image: "/image/merveille touristiique/Cascade de Monogaga.jpg", region: "Haut-Sassandra", link: "https://www.yafohi-travel.com/site-touristique/485/les-cascades-naturelles-de-man" },
    { id: 2, name: "Parc National de Taï", desc: "La plus grande forêt primaire d'Afrique de l'Ouest, classée à l'UNESCO.", locality: "San-Pédro", image: "/image/merveille touristiique/Sanctuaire de Taï.jpg", region: "Sud-Ouest", link: "https://fr.wikipedia.org/wiki/Parc_national_de_Ta%C3%AF" },
    { id: 3, name: "Plages de Grand-Bassam", desc: "Plages dorées et atmosphère historique. Berceau touristique de la Côte d'Ivoire.", locality: "Grand-Bassam, Sud-Est", image: "/image/merveille touristiique/Plages de Grand-Bassam.jpg", region: "Sud-Est", link: "https://www.tripadvisor.fr/Attraction_Review-g608433-d27512096-Reviews-Plage_De_Grand_Bassam-Grand_Bassam_Lagunes_Region.html" },
    { id: 4, name: "Fondation Félix Houphouët-Boigny", desc: "Chef-d'œuvre architectural décoré de marbre et de bois. Siège du Congrès pour la Paix de 1989.", locality: "Yamoussoukro, Centre", image: "/image/merveille touristiique/Palais Royaux d'Yamoussoukro.jpg", region: "Centre", link: "https://fr.wikipedia.org/wiki/Palais_pr%C3%A9sidentiel_de_Yamoussoukro" },
    { id: 5, name: "Îles Comoé", desc: "Archipel mystérieux avec des traditions séculaires et villages de pêcheurs.", locality: "Delta du Comoé, Assinie", image: "/image/merveille touristiique/Îles Comoe.jpg", region: "Sud-Est", link: "https://fr.wikipedia.org/wiki/Como%C3%A9_(fleuve)" },
    { id: 6, name: "Forêt de Bossématié", desc: "Site sacré pour les Kroumen. La maison des esprits selon les traditions locales.", locality: "Adiouci, Centre-Est", image: "/image/merveille touristiique/Forêt de Classée de Bossématié.jpg", region: "Centre-Est", link: "https://fr.wikipedia.org/wiki/R%C3%A9serve_naturelle_de_Boss%C3%A9mati%C3%A9" },
    { id: 7, name: "Basilique de Yamoussoukro", desc: "La plus grande basilique chrétienne du monde, cœur de la capitale politique.", locality: "Yamoussoukro", image: "/image/merveille touristiique/Musée de Yamoussoukro.jpg", region: "Centre", link: "https://fr.wikipedia.org/wiki/Basilique_Notre-Dame-de-la-Paix_de_Yamoussoukro" },
    { id: 8, name: "Mont Nimba", desc: "Territoire sacré et refuge naturel aux reliefs spectaculaires classé à l'UNESCO.", locality: "Man, Nord-Ouest", image: "/image/merveille touristiique/Mont Nimba.jpg", region: "Nord", link: "https://fr.wikipedia.org/wiki/Mont_Nimba" },
  ];

  const regionColor: Record<string, string> = {
    'Haut-Sassandra': '#228B22', 'Sud-Ouest': '#1A4A1A', 'Sud-Est': '#B8622A',
    'Centre': '#C8960C', 'Centre-Est': '#FF8C00', 'Nord': '#4A2E1A',
  };

  const filtered = sites.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.locality.toLowerCase().includes(query.toLowerCase()) ||
    s.region.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-xl lg:max-w-2xl mx-auto pb-24 sm:pb-28 space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="space-y-2 mb-6 sm:mb-8">
        <div className="trame-divider w-16" />
        <h2 className="text-3xl sm:text-4xl font-philosopher font-bold text-[#111111] leading-tight">
          {t('wonders.title', lang)}
        </h2>
        <p className="font-playfair italic text-[#9C6644] text-[14px] sm:text-[15px]">
          {t('wonders.subtitle', lang)}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#111111]/30" size={16} />
        <input
          type="text"
          placeholder={t('wonders.search', lang)}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-[#F5EFE6] border border-[#9C6644]/20 focus:border-[#1B4332] outline-none transition-all font-inter text-[13px] rounded-sm text-[#111111] placeholder-[#111111]/30"
        />
      </div>

      {/* Cards */}
      <div className="space-y-8">
        {filtered.map((site) => (
          <motion.div key={site.id} whileHover={{ y: -2 }} className="group">
            <div className="relative h-48 sm:h-56 overflow-hidden rounded-sm border border-[#9C6644]/10 mb-3">
              <img src={site.image} alt={site.name} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.7), transparent 40%)' }} />
              <span
                className="absolute bottom-3 left-3 px-3 py-1 bg-[#111111]/80 backdrop-blur-sm rounded-full text-white text-[10px] font-inter font-medium uppercase tracking-[0.15em] border border-white/10"
              >
                {site.region}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-philosopher font-bold text-[#111111] text-lg">{site.name}</h3>
              <p className="font-inter text-[#111111]/70 text-sm leading-relaxed">{site.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <p className="font-inter text-xs text-[#111111]/40 flex items-center gap-1.5 uppercase font-medium tracking-wider">
                  <MapIcon size={12} /> {site.locality}
                </p>
                <a
                  href={site.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-inter text-xs font-bold uppercase tracking-widest hover:gap-2 transition-all"
                  style={{ color: '#F77F00' }}
                >
                  {t('wonders.discover', lang)} <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-24 font-playfair italic text-[#111111]/40 text-lg">{t('wonders.noResult', lang)}</div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// LEARN VIEW
// ─────────────────────────────────────────────────────────────
const LearnView = () => {
  const { lang } = useLanguage();
  const [ok, setOk] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [pin, setPin] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudo && pin.length === 4) setOk(true);
  };

  if (!ok) {
    return (
      <div className="max-w-sm mx-auto pt-8 sm:pt-12 pb-24 sm:pb-28 px-4">
        <div className="card p-6 sm:p-8 space-y-6 sm:space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="font-philosopher font-bold text-2xl sm:text-3xl text-[#111111]">{t('learn.title', lang)}</h2>
            <p className="font-playfair italic text-[#9C6644] text-xs sm:text-sm">{t('learn.subtitle', lang)}</p>
          </div>
          <div className="trame-divider w-full" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-inter text-[10px] font-semibold text-[#111111]/50 uppercase tracking-[0.2em]">{t('learn.name', lang)}</label>
              <div className="relative">
                <input type="text" value={pseudo} onChange={e => setPseudo(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5EFE6] border border-[#9C6644]/20 focus:border-[#1B4332] font-inter text-sm outline-none transition-all rounded-sm text-[#111111]"
                  placeholder="Ex: Kwame..." required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-inter text-[10px] font-semibold text-[#111111]/50 uppercase tracking-[0.2em]">{t('learn.pin', lang)}</label>
              <div className="relative">
                <input type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5EFE6] border border-[#9C6644]/20 focus:border-[#1B4332] font-inter text-center text-xl tracking-[0.5em] font-medium outline-none transition-all rounded-sm text-[#111111]"
                  placeholder="••••" required />
              </div>
            </div>
            <button type="submit"
              className="w-full py-4 rounded-full font-inter font-medium text-white text-[13px] uppercase tracking-wider transition-all hover:bg-[#1B4332] active:scale-[0.98] bg-[#111111] mt-2 shadow-lg shadow-[#111111]/10">
              {t('learn.enter', lang)}
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto pb-24 sm:pb-28 px-4">
      <Academy pseudo={pseudo} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
const tabConfig = [
  { id: 'home', icon: Home, labelKey: 'nav.home' as const },
  { id: 'culture', icon: Globe, labelKey: 'nav.culture' as const },
  { id: 'wonders', icon: MapIcon, labelKey: 'nav.wonders' as const },
  { id: 'scanner', icon: Camera, labelKey: 'nav.scanner' as const },
  { id: 'translator', icon: Languages, labelKey: 'nav.translator' as const },
  { id: 'voice', icon: Mic, labelKey: 'nav.voice' as const },
  { id: 'learn', icon: GraduationCap, labelKey: 'nav.learn' as const },
] as const;

export default function App() {
  const { lang, setLang, setLanguageAndReload } = useLanguage();
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [activeCulturalSite, setActiveCulturalSite] = useState<string | null>(null);
  const [activeCulturalSiteUrl, setActiveCulturalSiteUrl] = useState<string | null>(null);
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);

  const handleNavigateToProfile = (name: string) => {
    setDiscoverSearch(name);
    setActiveTab('culture');
  };

  const handleCulturalSiteMatch = (slug: string, url: string) => {
    setActiveCulturalSite(slug);
    setActiveCulturalSiteUrl(url);
  };

  // Clear site overlay when user switches tab
  const handleTabChange = (tab: Tab) => {
    setActiveCulturalSite(null);
    setActiveCulturalSiteUrl(null);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#F5EFE6' }}>
      <AnimatePresence>
        {!isStarted && (
          <motion.div key="landing" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
            <LandingScreen onStart={() => setIsStarted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {isStarted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen"
        >
          {/* ── TOP HEADER ── */}
          <header
            className="sticky top-0 z-50 border-b"
            style={{
              background: 'linear-gradient(135deg, rgba(230,185,80,0.92) 0%, rgba(200,152,50,0.95) 100%)',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(120,80,0,0.18)',
            }}
          >
            <div className="max-w-xl lg:max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
              {/* Bouton retour doré épuré */}
              <button
                onClick={() => setIsStarted(false)}
                className="flex items-center gap-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-70"
                style={{ color: 'rgba(60,30,0,0.65)' }}
              >
                ← Retour
              </button>

              {/* Logo + Titre */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: 'rgba(80,50,0,0.3)' }}>
                  <img src="/logo.jpeg" alt="Moyé" className="w-full h-full object-cover" />
                </div>
                <span className="font-philosopher font-bold text-xl" style={{ color: '#1A1008' }}>Moyé</span>
              </div>

              <div className="w-16 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowLanguagePanel(true)}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] bg-[#111111]/5 border border-[#111111]/20 text-[#111111] hover:bg-[#111111]/10 transition-colors"
                >
                  <Languages size={12} className="opacity-80" />
                  <span>{lang.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </header>

          {/* ── CONTENT ── */}
          <main className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 max-w-xl lg:max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'home' && <HomeView />}
                {activeTab === 'culture' && <DiscoverView initialSearch={discoverSearch} />}
                {activeTab === 'wonders' && <TouristicWondersView />}
                {activeTab === 'scanner' && (
                  <AIScanner
                    onNavigateToProfile={handleNavigateToProfile}
                    onCulturalSiteMatch={handleCulturalSiteMatch}
                  />
                )}
                {activeTab === 'translator' && <TranslatorView />}
                {activeTab === 'voice' && <VoiceView />}
                {activeTab === 'learn' && <LearnView />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* ── BOTTOM NAV (défilable horizontalement sur mobile, centré sur desktop) ── */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom bg-[#111111]/95 backdrop-blur-xl border-t border-[#F5EFE6]/10 pb-[env(safe-area-inset-bottom)]">
            <div className="trame-divider opacity-10" />
            <div
              className="bottom-nav-scroll flex items-center justify-center lg:justify-center gap-0.5 px-2 py-2 overflow-x-auto overflow-y-hidden overscroll-x-contain max-w-xl lg:max-w-4xl mx-auto"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex items-center justify-start lg:justify-center gap-0.5 min-w-min">
              {tabConfig.map(({ id, icon: Icon, labelKey }) => {
                const active = activeTab === id;
                const label = t(labelKey, lang);
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as Tab)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all flex-shrink-0 min-w-[4.25rem]',
                      active ? 'opacity-100' : 'opacity-40 hover:opacity-60'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-sm flex items-center justify-center transition-all',
                      active ? 'bg-[#1B4332]' : '')}>
                      <Icon
                        size={17}
                        style={{ color: active ? '#F5EFE6' : '#F5EFE6', opacity: active ? 1 : 0.4 }}
                      />
                    </div>
                    <span
                      className="font-inter text-[9px] leading-none tracking-[0.05em] uppercase font-semibold transition-all"
                      style={{ color: active ? '#F5EFE6' : 'rgba(245,239,230,0.4)' }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          </nav>
        </motion.div>
      )}
      {isStarted && <MoyéAssistant />}
      {/* ── GLOBAL LANGUAGE PANEL ── */}
      <AnimatePresence>
        {showLanguagePanel && (
          <motion.div
            key="language-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-start justify-end bg-black/30"
            onClick={() => setShowLanguagePanel(false)}
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-16 mr-4 w-56 rounded-2xl bg-[#F5EFE6] shadow-2xl border border-[#111111]/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#111111]/10">
                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-[#111111]">
                  {t('lang.site', lang)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowLanguagePanel(false)}
                  className="p-1 text-[#111111]/50 hover:text-[#111111]"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
              <div className="px-3 py-2 space-y-1">
                {[
                  { code: 'fr' as const, label: 'Français' },
                  { code: 'en' as const, label: 'English' },
                  { code: 'es' as const, label: 'Español' },
                ].map((item) => {
                  const isActive = lang === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguageAndReload(item.code);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm',
                        isActive
                          ? 'bg-[#111111] text-[#F5EFE6]'
                          : 'text-[#111111] hover:bg-[#111111]/5'
                      )}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="text-[10px] uppercase tracking-[0.16em]">
                          {t('lang.active', lang)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── CULTURAL SITE IFRAME OVERLAY ── */}
      <AnimatePresence>
        {isStarted && activeCulturalSite && (
          <motion.div
            key="cultural-iframe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] flex flex-col"
            style={{ background: '#F5EFE6' }}
          >
            {/* slim top bar */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: '#111111', borderBottom: '1px solid #1B4332' }}
            >
              <button
                onClick={() => setActiveCulturalSite(null)}
                className="flex items-center gap-1.5 text-[#F5EFE6] font-inter text-xs hover:text-[#F77F00] transition-colors uppercase tracking-widest font-semibold"
              >
                <CloseIcon size={14} /> {t('close', lang)}
              </button>
              <div className="flex-1 text-center">
                <span className="font-philosopher text-[#F5EFE6] text-[15px] font-bold">{t('oeil.title', lang)}</span>
              </div>
              <div className="w-16" />
            </div>
            {/* actual HTML site */}
            <iframe
              key={activeCulturalSiteUrl}
              src={activeCulturalSiteUrl || `/oeil-moye/${activeCulturalSite}/index.html`}
              className="flex-1 w-full border-0"
              title="Site culturel"
              allow="fullscreen"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
