import React, { useState, useMemo } from 'react';
import {
  Languages,
  Volume2,
  ArrowRightLeft,
  Search,
  BookOpen,
  ChevronDown,
  X,
  Info,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  crossTranslate,
  getByLangue,
  getSharedVocabulary,
  LANGUES_WITH_FR,
  type LangueOrFr,
} from '../lib/dictionary';
import { cn } from '../lib/utils';

// ─── Quick-phrase chips ───────────────────────────────────────────────────────
const QUICK_PHRASES: { label: string; from: LangueOrFr }[] = [
  { label: 'Bonjour', from: 'Français' },
  { label: 'Merci', from: 'Français' },
  { label: 'Bienvenue', from: 'Français' },
  { label: "Comment ça va ?", from: 'Français' },
  { label: 'Eau', from: 'Français' },
  { label: 'Enfant', from: 'Français' },
  { label: 'Akwaba', from: 'Baoulé' },
  { label: 'Tadjinn', from: 'Sénoufo' },
  { label: 'I ni sogoma', from: 'Dioula' },
];

// ─── Language selector ────────────────────────────────────────────────────────
const LangSelect = ({
  value,
  onChange,
  exclude,
  label,
}: {
  value: LangueOrFr;
  onChange: (v: LangueOrFr) => void;
  exclude?: LangueOrFr;
  label: string;
}) => (
  <div className="flex-1 flex flex-col gap-1">
    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
      {label}
    </span>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LangueOrFr)}
        className="w-full appearance-none bg-white border-2 border-stone-200 font-bold text-sm rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-ivory-orange transition-colors"
      >
        {LANGUES_WITH_FR.filter((l) => l !== exclude).map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
      />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Translator = () => {
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState<LangueOrFr>('Français');
  const [to, setTo] = useState<LangueOrFr>('Baoulé');
  const [showLexique, setShowLexique] = useState(false);
  const [showShared, setShowShared] = useState(false);

  const results = useMemo(
    () => crossTranslate(query, from, to),
    [query, from, to]
  );

  // Vocabulaire partagé entre les deux langues sélectionnées
  const sharedVocab = useMemo(
    () => (from !== 'Français' && to !== 'Français') ? getSharedVocabulary(from, to) : [],
    [from, to]
  );

  const lexiqueEntries = useMemo(
    () => (to !== 'Français' ? getByLangue(to) : []),
    [to]
  );

  const speak = (text: string) => {
    if (!text) return;
    window.speechSynthesis.speak(
      Object.assign(new SpeechSynthesisUtterance(text), { lang: 'fr-FR' })
    );
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setQuery('');
  };

  const isCross = from !== 'Français' && to !== 'Français';

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Sélecteurs FROM / TO ── */}
      <div className="flex items-end gap-3 bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
        <LangSelect value={from} onChange={setFrom} exclude={to} label="De" />
        <button
          onClick={swap}
          className="mb-0.5 p-2.5 rounded-xl bg-ivory-orange text-white shadow hover:bg-ivory-orange/90 active:scale-95 transition-all shrink-0"
          title="Inverser"
        >
          <ArrowRightLeft size={18} />
        </button>
        <LangSelect value={to} onChange={setTo} exclude={from} label="Vers" />
      </div>

      {/* ── Bandeau pivot + vocabulaire commun ── */}
      {isCross && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          {/* Info pivot */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-ivory-orange/10 rounded-xl text-xs font-medium text-ivory-orange border border-ivory-orange/20">
            <Info size={14} className="shrink-0" />
            Traduction croisée via pivot français :{' '}
            <span className="font-black">{from} → Français → {to}</span>
            {sharedVocab.length > 0 && (
              <span className="ml-auto bg-ivory-orange text-white px-2 py-0.5 rounded-full font-black text-[11px]">
                {sharedVocab.length} mots communs
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Barre de recherche ── */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Chercher un mot en ${from}…`}
          className="w-full pl-11 pr-11 py-4 rounded-2xl bg-white border-2 border-stone-200 focus:border-ivory-orange outline-none text-base font-inter shadow-sm transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Phrases rapides ── */}
      {!query && (
        <div className="flex flex-wrap gap-2">
          {QUICK_PHRASES.map((p) => (
            <button
              key={p.label + p.from}
              onClick={() => { setFrom(p.from); setQuery(p.label); }}
              className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-sm hover:bg-ivory-orange/10 hover:text-ivory-orange transition-colors font-medium"
            >
              <span className="text-stone-400 text-xs mr-1">{p.from}</span>
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Résultats ── */}
      <AnimatePresence mode="wait">
        {query && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-2"
          >
            {results.length > 0 ? (
              <>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-widest px-1">
                  {results.length} résultat{results.length > 1 ? 's' : ''} — {from} → {to}
                </p>
                {results.map((r, i) => (
                  <motion.div
                    key={`${r.cible}-${i}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-stone-100 hover:border-ivory-orange/30 transition-all group"
                  >
                    {/* Source */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">{from}</p>
                      <p className="text-stone-600 text-sm font-medium truncate">{r.expression}</p>
                    </div>

                    {/* Pivot FR (en mode croisé) */}
                    {isCross && (
                      <>
                        <div className="flex flex-col items-center shrink-0 text-stone-300">
                          <ArrowRightLeft size={12} />
                          <span className="text-[9px] uppercase tracking-widest mt-0.5">fr</span>
                        </div>
                        <div className="w-24 min-w-0 hidden sm:block">
                          <p className="text-[10px] text-stone-300 font-bold uppercase tracking-widest mb-0.5">Pivot</p>
                          <p className="text-stone-400 text-xs italic truncate">{r.frenchPivot}</p>
                        </div>
                      </>
                    )}

                    <ArrowRightLeft size={16} className="text-ivory-orange shrink-0" />

                    {/* Cible */}
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">{to}</p>
                      <p className="text-xl font-bold text-ivory-earth truncate font-philosopher">{r.cible}</p>
                    </div>

                    <button
                      onClick={() => speak(r.cible)}
                      className="p-2 rounded-full text-stone-300 hover:text-ivory-green hover:bg-ivory-green/10 transition-all shrink-0"
                    >
                      <Volume2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 text-stone-400">
                <Languages size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Aucun résultat pour « {query} »</p>
                <p className="text-sm mt-1 max-w-xs mx-auto">
                  {isCross
                    ? `Ces deux langues ne partagent peut-être pas ce mot dans leurs bases de données. Consultez le vocabulaire commun ci-dessous.`
                    : 'Essayez un autre mot ou changez de langue.'}
                </p>
                {isCross && sharedVocab.length > 0 && (
                  <button
                    onClick={() => setShowShared(true)}
                    className="mt-3 px-4 py-2 bg-ivory-orange/10 text-ivory-orange rounded-full text-sm font-bold hover:bg-ivory-orange/20 transition-colors"
                  >
                    Voir les {sharedVocab.length} mots communs
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vocabulaire commun (deux langues locales) ── */}
      {isCross && sharedVocab.length > 0 && (
        <div className="border-t border-stone-100 pt-4">
          <button
            onClick={() => setShowShared((v) => !v)}
            className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-ivory-orange transition-colors w-full"
          >
            <Layers size={16} />
            Vocabulaire commun — {from} ↔ {to}
            <span className="ml-auto text-xs text-stone-400">{sharedVocab.length} mots</span>
            <ChevronDown size={16} className={cn('transition-transform', showShared && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {showShared && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-4 rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                  <div className="bg-stone-50 grid grid-cols-3 px-5 py-3 border-b border-stone-100">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{from}</p>
                    <p className="text-[10px] font-black text-ivory-orange uppercase tracking-widest text-center">Français</p>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">{to}</p>
                  </div>
                  <div className="divide-y divide-stone-50 max-h-80 overflow-y-auto">
                    {sharedVocab.map((w, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 items-center px-5 py-3 hover:bg-ivory-orange/5 transition-colors cursor-pointer group"
                        onClick={() => { setQuery(w.sourceExpressions[0]); setShowShared(false); }}
                      >
                        <span className="font-bold text-ivory-earth text-sm font-philosopher">{w.sourceExpressions[0]}</span>
                        <span className="text-stone-400 text-xs italic text-center">{w.frenchMeaning}</span>
                        <span className="font-bold text-stone-600 text-sm text-right">{w.targetExpressions[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Lexique complet (langue cible) ── */}
      {to !== 'Français' && (
        <div className="border-t border-stone-100 pt-4">
          <button
            onClick={() => setShowLexique((v) => !v)}
            className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-ivory-orange transition-colors w-full"
          >
            <BookOpen size={16} />
            Lexique complet — {to}
            <span className="ml-auto text-xs text-stone-400">{lexiqueEntries.length} mots</span>
            <ChevronDown size={16} className={cn('transition-transform', showLexique && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {showLexique && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-4 rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                  <div className="bg-stone-50 px-4 py-3 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{to} — Dictionnaire</p>
                  </div>
                  <div className="divide-y divide-stone-50 max-h-80 overflow-y-auto">
                    {lexiqueEntries.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-5 py-3 hover:bg-ivory-orange/5 transition-colors group"
                      >
                        <span className="font-bold text-ivory-earth font-philosopher">{entry.expression}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500 text-sm">{entry.traduction}</span>
                          <button onClick={() => speak(entry.expression)} className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-stone-300 hover:text-ivory-green transition-all">
                            <Volume2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
