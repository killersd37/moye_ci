import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MessageSquare, Languages, ArrowLeft, CheckCircle, XCircle,
    Star, Trophy, Zap, BookOpen, Volume2, ChevronRight, RotateCcw,
    Heart, Flame, Award
} from 'lucide-react';
import { cn } from '../lib/utils';

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const quizQuestions = [
    {
        id: 1, category: 'Proverbes', langue: 'Baoulé',
        question: 'Que signifie le proverbe Baoulé : "Akwaba" ?',
        options: ['Au revoir', 'Bienvenue', 'Merci', 'Bonne nuit'],
        answer: 1, explanation: 'Akwaba est le mot de bienvenue le plus célèbre de Côte d\'Ivoire, utilisé par les Baoulé et répandu dans tout le pays.'
    },
    {
        id: 2, category: 'Traditions', langue: 'Sénoufo',
        question: 'Qu\'est-ce que le "Poro" chez les Sénoufo ?',
        options: ['Un plat traditionnel', 'Une danse cérémonielle', 'La société d\'initiation', 'Un instrument de musique'],
        answer: 2, explanation: 'Le Poro est la société secrète d\'initiation des Sénoufo, centrale dans leur organisation sociale et spirituelle.'
    },
    {
        id: 3, category: 'Vocabulaire', langue: 'Dioula',
        question: 'Comment dit-on "Bonjour le matin" en Dioula ?',
        options: ['I ni wula', 'I ni sogoma', 'I ni tile', 'I ka kɛnɛ'],
        answer: 1, explanation: '"I ni sogoma" est le salut matinal en Dioula. "I ni tile" est pour la journée et "I ni wula" pour le soir.'
    },
    {
        id: 4, category: 'Histoire', langue: 'Général',
        question: 'Combien d\'ethnies la Côte d\'Ivoire compte-t-elle approximativement ?',
        options: ['Plus de 30', 'Plus de 40', 'Plus de 60', 'Plus de 80'],
        answer: 2, explanation: 'La Côte d\'Ivoire est l\'un des pays les plus diversifiés d\'Afrique avec plus de 60 ethnies réparties en 4 grands groupes.'
    },
    {
        id: 5, category: 'Vocabulaire', langue: 'Baoulé',
        question: 'Que signifie "N\'dié" en Baoulé ?',
        options: ['Bonsoir', 'Merci', 'Bonjour', 'Au revoir'],
        answer: 2, explanation: '"N\'dié" est le salut de base en Baoulé, utilisé pour dire bonjour à toute heure de la journée.'
    },
    {
        id: 6, category: 'Culture', langue: 'Yacouba',
        question: 'Les Yacouba sont célèbres pour quel art traditionnel unique au monde ?',
        options: ['La peinture sur tissu', 'La danse acrobatique sur échasse', 'La sculpture sur ivoire', 'Le tissage de soie'],
        answer: 1, explanation: 'La danse sur échasse des Yacouba (Dan) de Man est inscrite au patrimoine immatériel de l\'UNESCO pour son caractère unique et acrobatique.'
    },
    {
        id: 7, category: 'Vocabulaire', langue: 'Bété',
        question: 'Comment dit-on "Eau" en Bété ?',
        options: ['Ji', 'N\'zue', 'Gnou', 'Yi'],
        answer: 2, explanation: '"Gnou" signifie eau en Bété. Les différentes ethnies ivoiriennes ont des mots très distincts pour les éléments naturels.'
    },
    {
        id: 8, category: 'Traditions', langue: 'Baoulé',
        question: 'Qu\'est-ce que le "Goli" chez les Baoulé ?',
        options: ['Un roi', 'Un masque cérémoniel', 'Un plat', 'Une fête'],
        answer: 1, explanation: 'Le Goli est un masque sacré baoulé utilisé lors des cérémonies funéraires et des fêtes pour honorer les ancêtres.'
    },
    {
        id: 9, category: 'Vocabulaire', langue: 'Dioula',
        question: 'Que signifie "An" en Dioula ?',
        options: ['Vous', 'Toi', 'Nous (inclusif)', 'Eux'],
        answer: 2, explanation: '"An" signifie "nous" de manière inclusive en Dioula, incluant la personne à qui l\'on parle. "Aw" signifie "vous".'
    },
    {
        id: 10, category: 'Histoire', langue: 'Agni',
        question: 'Comment s\'appelle le nom royal "Roi" en Agni ?',
        options: ['Nanan', 'Famien', 'Dugutigi', 'Blignon'],
        answer: 1, explanation: '"Famien" désigne le roi en Agni. Le titre est héréditaire et le Famien est le gardien des traditions et de l\'autorité du peuple Agni.'
    },
    {
        id: 11, category: 'Culture', langue: 'Sénoufo',
        question: 'Quelle est la signification de "Tadjinn" en Sénoufo ?',
        options: ['Bonsoir', 'Bienvenue', 'Merci', 'Bonjour'],
        answer: 3, explanation: '"Tadjinn" est le salut en Sénoufo, équivalent de "Bonjour". Les Sénoufo du nord de la Côte d\'Ivoire utilisent cette formule de politesse.'
    },
    {
        id: 12, category: 'Proverbes', langue: 'Général',
        question: 'Quel groupe linguistique regroupe Baoulé, Agni et Abron ?',
        options: ['Groupe Mandé', 'Groupe Krou', 'Groupe Akan', 'Groupe Gour'],
        answer: 2, explanation: 'Le Baoulé, l\'Agni et l\'Abron appartiennent au grand groupe Akan, originaire d\'Afrique de l\'Ouest. Les Akan représentent environ 42% de la population ivoirienne.'
    },
];

// ─── LANGUAGE MODULE DATA ──────────────────────────────────────────────────────
const languageModules = [
    {
        id: 'dioula', name: 'Dioula', flag: '🟢', color: 'bg-[#1B4332]',
        bgLight: 'bg-[#F5EFE6]', border: 'border-[#9C6644]/20',
        description: 'Lingua franca de Côte d\'Ivoire, parlée par plus de 7 millions de personnes.',
        lessons: [
            {
                id: 1, title: 'Les Salutations', emoji: '👋', xp: 10,
                cards: [
                    { local: 'I ni sogoma', french: 'Bonjour (matin)', phonetic: 'ee-nee-so-go-ma' },
                    { local: 'I ni tile', french: 'Bonjour (journée)', phonetic: 'ee-nee-tee-leh' },
                    { local: 'I ni wula', french: 'Bonsoir', phonetic: 'ee-nee-woo-la' },
                    { local: 'I ka kɛnɛ ?', french: 'Ça va ?', phonetic: 'ee-ka-keh-neh' },
                    { local: 'N ka kɛnɛ', french: 'Ça va bien', phonetic: 'n-ka-keh-neh' },
                    { local: 'Kana bɔ!', french: 'Au revoir!', phonetic: 'ka-na-boh' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Traduisez : "Bonjour le matin"', answer: 'I ni sogoma', options: ['I ni tile', 'I ni sogoma', 'I ni wula', 'Kana bɔ'] },
                    { type: 'translate', prompt: 'Que signifie "I ka kɛnɛ ?" ?', answer: 'Ça va ?', options: ['Au revoir', 'Bonjour', 'Ça va ?', 'Merci'] },
                    { type: 'translate', prompt: 'Comment dire "Bonsoir" en Dioula ?', answer: 'I ni wula', options: ['I ni tile', 'I ni wula', 'I ni sogoma', 'N ka kɛnɛ'] },
                ]
            },
            {
                id: 2, title: 'La Famille', emoji: '👨‍👩‍👧', xp: 15,
                cards: [
                    { local: 'Faa', french: 'Père', phonetic: 'faa' },
                    { local: 'Ba', french: 'Mère', phonetic: 'baa' },
                    { local: 'Den', french: 'Enfant', phonetic: 'den' },
                    { local: 'Ke', french: 'Homme', phonetic: 'keh' },
                    { local: 'Muso', french: 'Femme', phonetic: 'moo-so' },
                    { local: 'Dugutigi', french: 'Chef de village', phonetic: 'doo-goo-tee-gee' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Comment dit-on "Père" en Dioula ?', answer: 'Faa', options: ['Ba', 'Faa', 'Den', 'Ke'] },
                    { type: 'translate', prompt: 'Que signifie "Muso" ?', answer: 'Femme', options: ['Homme', 'Enfant', 'Femme', 'Mère'] },
                    { type: 'translate', prompt: 'Traduisez : "Enfant"', answer: 'Den', options: ['Ke', 'Ba', 'Faa', 'Den'] },
                ]
            },
            {
                id: 3, title: 'Les Chiffres', emoji: '🔢', xp: 20,
                cards: [
                    { local: 'Kelen', french: 'Un', phonetic: 'keh-len' },
                    { local: 'Fila', french: 'Deux', phonetic: 'fee-la' },
                    { local: 'Saba', french: 'Trois', phonetic: 'sa-ba' },
                    { local: 'Nani', french: 'Quatre', phonetic: 'na-nee' },
                    { local: 'Duuru', french: 'Cinq', phonetic: 'doo-roo' },
                    { local: 'Tan', french: 'Dix', phonetic: 'tan' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Comment dit-on "Deux" en Dioula ?', answer: 'Fila', options: ['Kelen', 'Fila', 'Saba', 'Nani'] },
                    { type: 'translate', prompt: 'Que signifie "Duuru" ?', answer: 'Cinq', options: ['Quatre', 'Six', 'Cinq', 'Trois'] },
                    { type: 'translate', prompt: 'Traduisez "Dix" en Dioula', answer: 'Tan', options: ['Fila', 'Kelen', 'Tan', 'Nani'] },
                ]
            },
        ]
    },
    {
        id: 'baoule', name: 'Baoulé', flag: '🟠', color: 'bg-[#9C6644]',
        bgLight: 'bg-[#F5EFE6]', border: 'border-[#9C6644]/20',
        description: 'Langue du peuple Baoulé, l\'un des plus grands groupes ethniques de Côte d\'Ivoire.',
        lessons: [
            {
                id: 1, title: 'Les Salutations', emoji: '👋', xp: 10,
                cards: [
                    { local: 'N\'dié', french: 'Bonjour', phonetic: 'n-dyeh' },
                    { local: 'Akwaba', french: 'Bienvenue', phonetic: 'a-kwa-ba' },
                    { local: 'Mo', french: 'Merci', phonetic: 'mo' },
                    { local: 'Ô tché ?', french: 'Ça va ?', phonetic: 'o-tcheh' },
                    { local: 'Ô ti kpa', french: 'Ça va bien', phonetic: 'o-tee-kpa' },
                    { local: 'Amon ni', french: 'Au revoir', phonetic: 'a-mon-nee' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Que signifie "Akwaba" ?', answer: 'Bienvenue', options: ['Bonjour', 'Merci', 'Bienvenue', 'Au revoir'] },
                    { type: 'translate', prompt: 'Comment dire "Merci" en Baoulé ?', answer: 'Mo', options: ['Amon ni', 'Mo', 'N\'dié', 'Koussê'] },
                    { type: 'translate', prompt: 'Traduisez "Ça va bien"', answer: 'Ô ti kpa', options: ['Ô tché ?', 'Ô ti kpa', 'N\'dié', 'Akwaba'] },
                ]
            },
            {
                id: 2, title: 'Le Corps Humain', emoji: '🫀', xp: 15,
                cards: [
                    { local: 'N\'glô', french: 'Ciel / Tête', phonetic: 'n-glo' },
                    { local: 'You', french: 'Œil', phonetic: 'you' },
                    { local: 'Sin', french: 'Sein', phonetic: 'sin' },
                    { local: 'Kpon', french: 'Pied / Pain', phonetic: 'kpon' },
                    { local: 'Calon', french: 'Cœur', phonetic: 'ka-lon' },
                    { local: 'Sran', french: 'Personne', phonetic: 'sran' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Que signifie "Sran" en Baoulé ?', answer: 'Personne', options: ['Homme', 'Femme', 'Personne', 'Enfant'] },
                    { type: 'translate', prompt: 'Comment dit-on "Œil" en Baoulé ?', answer: 'You', options: ['Sin', 'You', 'Kpon', 'N\'glô'] },
                    { type: 'translate', prompt: 'Traduisez "Cœur"', answer: 'Calon', options: ['Sran', 'You', 'Calon', 'Kpon'] },
                ]
            },
            {
                id: 3, title: 'La Nature', emoji: '🌿', xp: 20,
                cards: [
                    { local: 'Jari', french: 'Soleil', phonetic: 'ja-ree' },
                    { local: 'Oka', french: 'Lune', phonetic: 'o-ka' },
                    { local: 'Doua', french: 'Pluie', phonetic: 'do-wa' },
                    { local: 'N\'zue', french: 'Eau', phonetic: 'n-zoo-eh' },
                    { local: 'Waka', french: 'Arbre', phonetic: 'wa-ka' },
                    { local: 'Asié', french: 'Terre', phonetic: 'a-see-eh' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Comment dit-on "Soleil" en Baoulé ?', answer: 'Jari', options: ['Oka', 'Jari', 'Doua', 'Waka'] },
                    { type: 'translate', prompt: 'Que signifie "N\'zue" ?', answer: 'Eau', options: ['Pluie', 'Arbre', 'Lune', 'Eau'] },
                    { type: 'translate', prompt: 'Traduisez "Terre"', answer: 'Asié', options: ['Waka', 'Asié', 'Jari', 'N\'zue'] },
                ]
            },
        ]
    },
    {
        id: 'bete', name: 'Bété', flag: '🔴', color: 'bg-[#F77F00]',
        bgLight: 'bg-[#F5EFE6]', border: 'border-[#9C6644]/20',
        description: 'Langue du peuple Bété, groupe Krou de l\'ouest de la Côte d\'Ivoire.',
        lessons: [
            {
                id: 1, title: 'Les Salutations', emoji: '👋', xp: 10,
                cards: [
                    { local: 'Abouo', french: 'Bonjour', phonetic: 'a-boo-o' },
                    { local: 'N\'zaza', french: 'Bienvenue', phonetic: 'n-za-za' },
                    { local: 'Ayoka', french: 'Merci', phonetic: 'a-yo-ka' },
                    { local: 'O gnini ?', french: 'Ça va ?', phonetic: 'o-gnee-nee' },
                    { local: 'Gni ka', french: 'C\'est bon', phonetic: 'gnee-ka' },
                    { local: 'O mami', french: 'À demain', phonetic: 'o-ma-mee' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Comment dit-on "Bonjour" en Bété ?', answer: 'Abouo', options: ['N\'zaza', 'Abouo', 'Ayoka', 'Gni ka'] },
                    { type: 'translate', prompt: 'Que signifie "Ayoka" ?', answer: 'Merci', options: ['Bonjour', 'Bienvenue', 'Merci', 'Au revoir'] },
                    { type: 'translate', prompt: 'Traduisez "Ça va ?"', answer: 'O gnini ?', options: ['O mami', 'Gni ka', 'O gnini ?', 'Abouo'] },
                ]
            },
            {
                id: 2, title: 'La Nature', emoji: '🌿', xp: 15,
                cards: [
                    { local: 'Télé', french: 'Soleil', phonetic: 'teh-leh' },
                    { local: 'Gnou', french: 'Eau', phonetic: 'gnoo' },
                    { local: 'Bô', french: 'Terre', phonetic: 'boh' },
                    { local: 'Soum', french: 'Arbre', phonetic: 'soom' },
                    { local: 'Koum', french: 'Forêt', phonetic: 'koom' },
                    { local: 'Zé', french: 'Jour', phonetic: 'zeh' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Que signifie "Télé" en Bété ?', answer: 'Soleil', options: ['Lune', 'Soleil', 'Eau', 'Arbre'] },
                    { type: 'translate', prompt: 'Comment dit-on "Forêt" en Bété ?', answer: 'Koum', options: ['Soum', 'Koum', 'Bô', 'Gnou'] },
                    { type: 'translate', prompt: 'Traduisez "Eau"', answer: 'Gnou', options: ['Zé', 'Gnou', 'Télé', 'Soum'] },
                ]
            },
        ]
    },
    {
        id: 'senoufo', name: 'Sénoufo', flag: '🔵', color: 'bg-[#111111]',
        bgLight: 'bg-[#F5EFE6]', border: 'border-[#9C6644]/20',
        description: 'Langue des Sénoufo, grand peuple du nord de la Côte d\'Ivoire.',
        lessons: [
            {
                id: 1, title: 'Les Salutations', emoji: '👋', xp: 10,
                cards: [
                    { local: 'Tadjinn', french: 'Bonjour', phonetic: 'ta-djeen' },
                    { local: 'Mi pwo', french: 'Merci', phonetic: 'mee-pwo' },
                    { local: 'Fotamana', french: 'Bienvenue', phonetic: 'fo-ta-ma-na' },
                    { local: 'Yeni a kadi ?', french: 'Ça va ?', phonetic: 'yeh-nee-a-ka-dee' },
                    { local: 'Kadi kpa', french: 'Bien', phonetic: 'ka-dee-kpa' },
                    { local: 'Kagôh', french: 'Fin / C\'est fini', phonetic: 'ka-goh' },
                ],
                exercises: [
                    { type: 'translate', prompt: 'Comment dit-on "Bonjour" en Sénoufo ?', answer: 'Tadjinn', options: ['Mi pwo', 'Fotamana', 'Tadjinn', 'Kadi kpa'] },
                    { type: 'translate', prompt: 'Que signifie "Mi pwo" ?', answer: 'Merci', options: ['Bonjour', 'Bienvenue', 'Merci', 'Bien'] },
                    { type: 'translate', prompt: 'Traduisez "Bienvenue"', answer: 'Fotamana', options: ['Tadjinn', 'Fotamana', 'Kadi kpa', 'Kagôh'] },
                ]
            },
        ]
    },
];

// ─── QUIZ COMPONENT ────────────────────────────────────────────────────────────
const QuizMode = ({ onBack }: { onBack: () => void }) => {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [finished, setFinished] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const q = quizQuestions[current];
    const isCorrect = selected === q.answer;
    const progress = ((current) / quizQuestions.length) * 100;

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        setShowExplanation(true);
        if (idx === q.answer) {
            setScore(s => s + 10 + streak * 2);
            setStreak(s => s + 1);
        } else {
            setLives(l => l - 1);
            setStreak(0);
        }
    };

    const handleNext = () => {
        if (lives === 0) { setFinished(true); return; }
        if (current + 1 >= quizQuestions.length) { setFinished(true); return; }
        setSelected(null);
        setShowExplanation(false);
        setCurrent(c => c + 1);
    };

    const handleRestart = () => {
        setCurrent(0); setSelected(null); setScore(0);
        setLives(3); setStreak(0); setFinished(false); setShowExplanation(false);
    };

    if (finished) {
        const pct = Math.round((score / (quizQuestions.length * 12)) * 100);
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto text-center space-y-8 py-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#F77F00] flex items-center justify-center shadow-xl border-4 border-[#111111]">
                    <Trophy size={48} className="text-[#111111]" />
                </div>
                <div>
                    <h2 className="text-4xl font-philosopher font-bold text-[#111111] mb-2">Quiz Terminé !</h2>
                    <p className="font-playfair italic text-[#9C6644] text-lg">Vous avez répondu à {quizQuestions.length} questions</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Score', value: score + ' pts', color: 'text-[#F77F00]' },
                        { label: 'Précision', value: pct + '%', color: 'text-[#1B4332]' },
                        { label: 'Vies', value: ['❤️', '❤️❤️', '❤️❤️❤️'][lives] || '💔', color: 'text-red-600' },
                    ].map((s, i) => (
                        <div key={i} className="bg-[#F5EFE6] border border-[#9C6644]/20 rounded-sm p-4 shadow-sm">
                            <p className={cn("text-xl font-philosopher font-bold", s.color)}>{s.value}</p>
                            <p className="text-[10px] text-[#111111]/40 font-semibold uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="flex-1 py-4 bg-[#111111] rounded-full text-[#F5EFE6] font-inter font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-[#1B4332]">
                        <RotateCcw size={16} /> Recommencer
                    </button>
                    <button onClick={onBack} className="flex-1 py-4 bg-[#F5EFE6] border border-[#9C6644]/30 text-[#111111] rounded-full font-inter font-semibold uppercase tracking-widest text-xs transition-all hover:bg-[#F5EFE6]/70">
                        Retour
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-ivory-orange transition-colors font-bold">
                    <ArrowLeft size={18} /> Retour
                </button>
                <div className="flex items-center gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Heart key={i} size={22} className={cn("transition-all", i < lives ? "text-red-500 fill-red-500" : "text-stone-200")} />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500" />
                    <span className="font-black text-stone-700">{streak}x</span>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-semibold text-[#111111]/50 uppercase tracking-widest">
                    <span>Question {current + 1}/{quizQuestions.length}</span>
                    <span className="text-[#F77F00]">{score} pts</span>
                </div>
                <div className="h-1 bg-[#F5EFE6] border border-[#9C6644]/10 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#1B4332] rounded-full" />
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-[#F5EFE6] border border-[#9C6644]/20 rounded-sm shadow-xl p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-[#111111] text-[#F5EFE6] text-[10px] font-semibold uppercase tracking-widest rounded-sm">{q.category}</span>
                        <span className="px-3 py-1 bg-[#1B4332] text-[#F5EFE6] text-[10px] font-semibold uppercase tracking-widest rounded-sm">{q.langue}</span>
                    </div>
                    <p className="text-2xl font-philosopher font-bold text-[#111111] leading-relaxed">{q.question}</p>

                    <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, idx) => {
                            let style = 'bg-[#F5EFE6] border-[#9C6644]/20 text-[#111111] hover:border-[#1B4332] hover:bg-[#1B4332]/5';
                            if (selected !== null) {
                                if (idx === q.answer) style = 'bg-[#1B4332]/10 border-[#1B4332] text-[#1B4332]';
                                else if (idx === selected && selected !== q.answer) style = 'bg-red-50 border-red-400 text-red-800';
                                else style = 'opacity-50 border-[#9C6644]/10';
                            }
                            return (
                                <motion.button key={idx} whileHover={selected === null ? { x: 4 } : {}} whileTap={selected === null ? { scale: 0.99 } : {}}
                                    onClick={() => handleSelect(idx)}
                                    className={cn("w-full text-left px-5 py-4 rounded-sm border font-inter font-medium text-[15px] transition-all flex items-center justify-between", style)}>
                                    <span>{opt}</span>
                                    {selected !== null && idx === q.answer && <CheckCircle size={18} />}
                                    {selected !== null && idx === selected && selected !== q.answer && <XCircle size={18} />}
                                </motion.button>
                            );
                        })}
                    </div>

                    {showExplanation && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={cn("p-5 rounded-sm border-l-4 text-[14px] font-inter leading-relaxed shadow-sm",
                                isCorrect ? "bg-[#1B4332]/5 border-[#1B4332] text-[#1B4332]" : "bg-red-50 border-red-400 text-red-800")}>
                            <p className="font-bold mb-1 uppercase tracking-widest text-[11px]">{isCorrect ? 'Excellent !' : 'Réponse attendue'}</p>
                            {q.explanation}
                        </motion.div>
                    )}

                    {selected !== null && (
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleNext}
                            className="w-full py-4 bg-[#111111] text-[#F5EFE6] rounded-full font-inter font-semibold uppercase tracking-widest text-[12px] flex items-center justify-center gap-2 hover:bg-[#1B4332] transition-colors shadow-lg">
                            {current + 1 >= quizQuestions.length || lives === 0 ? 'Voir les résultats' : 'Question suivante'} <ChevronRight size={18} />
                        </motion.button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─── LESSON CARD COMPONENT ─────────────────────────────────────────────────────
type Card = { local: string; french: string; phonetic: string };
type Exercise = { type: string; prompt: string; answer: string; options: string[] };
type Lesson = { id: number; title: string; emoji: string; xp: number; cards: Card[]; exercises: Exercise[] };

const LessonView = ({ lesson, onComplete, onBack }: { lesson: Lesson; onComplete: (xp: number) => void; onBack: () => void }) => {
    const [phase, setPhase] = useState<'learn' | 'practice'>('learn');
    const [cardIdx, setCardIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [exIdx, setExIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [correct, setCorrect] = useState(0);

    const card = lesson.cards[cardIdx];
    const ex = lesson.exercises[exIdx];

    const handleExAnswer = (opt: string) => {
        if (selected) return;
        setSelected(opt);
        if (opt === ex.answer) setCorrect(c => c + 1);
    };

    const handleExNext = () => {
        if (exIdx + 1 >= lesson.exercises.length) { onComplete(lesson.xp); return; }
        setSelected(null); setExIdx(e => e + 1);
    };

    if (phase === 'learn') {
        return (
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-ivory-orange transition-colors font-bold">
                        <ArrowLeft size={18} /> Retour
                    </button>
                    <span className="text-stone-400 font-semibold">{cardIdx + 1} / {lesson.cards.length}</span>
                </div>

                <div className="h-1 bg-[#111111]/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1B4332] rounded-full transition-all" style={{ width: `${((cardIdx + 1) / lesson.cards.length) * 100}%` }} />
                </div>

                <p className="text-center font-playfair italic text-[#9C6644] text-[15px]">Cliquez sur la carte pour voir la traduction</p>

                <motion.div onClick={() => setFlipped(f => !f)} className="cursor-pointer" whileHover={{ scale: 1.01 }}>
                    <div className="bg-[#111111] rounded-sm shadow-2xl p-10 text-center border border-[#9C6644]/30 min-h-[260px] flex flex-col items-center justify-center gap-6 relative">
                        <div className="dot-texture absolute inset-0 opacity-10" />
                        <Volume2 size={24} className="text-[#F77F00]/50 relative z-10" />
                        {!flipped ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative z-10">
                                <p className="text-4xl font-philosopher font-bold text-[#F5EFE6]">{card.local}</p>
                                <p className="text-[#F77F00] text-[11px] font-inter uppercase tracking-[0.2em] font-semibold">[{card.phonetic}]</p>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 relative z-10">
                                <p className="text-3xl font-philosopher font-bold text-[#F5EFE6]">{card.french}</p>
                                <div className="trame-divider w-12 mx-auto opacity-50" />
                                <p className="text-[#F5EFE6]/50 text-[11px] font-inter uppercase tracking-widest">en {lesson.title}</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => { setFlipped(false); setCardIdx(i => Math.max(0, i - 1)); }}
                        disabled={cardIdx === 0} className="flex-1 py-3.5 bg-[#F5EFE6] text-[#111111]/50 border border-[#9C6644]/20 rounded-full font-inter font-semibold text-[11px] uppercase tracking-widest disabled:opacity-20">
                        ← Précédent
                    </button>
                    {cardIdx + 1 < lesson.cards.length ? (
                        <button onClick={() => { setFlipped(false); setCardIdx(i => i + 1); }}
                            className="flex-1 py-3.5 bg-[#1B4332] text-[#F5EFE6] rounded-full font-inter font-semibold text-[11px] uppercase tracking-widest hover:bg-[#111111] transition-all">
                            Suivant →
                        </button>
                    ) : (
                        <button onClick={() => setPhase('practice')}
                            className="flex-1 py-3.5 bg-[#F77F00] text-[#111111] rounded-full font-inter font-bold uppercase tracking-[0.15em] text-[11px] shadow-lg">
                            Pratiquer 🎯
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Practice phase
    const isCorrectAnswer = selected === ex.answer;
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => { setPhase('learn'); setCardIdx(0); setFlipped(false); }}
                    className="flex items-center gap-2 text-stone-500 hover:text-ivory-orange transition-colors font-bold">
                    <ArrowLeft size={18} /> Réviser
                </button>
                <span className="text-stone-400 font-semibold">Exercice {exIdx + 1} / {lesson.exercises.length}</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={exIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-[#F5EFE6] border border-[#9C6644]/20 rounded-sm shadow-xl p-8 space-y-6">
                    <p className="text-[17px] font-philosopher font-bold text-[#111111]">{ex.prompt}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ex.options.map((opt) => {
                            let style = 'bg-[#F5EFE6] border-[#9C6644]/20 hover:border-[#1B4332] text-[#111111]';
                            if (selected) {
                                if (opt === ex.answer) style = 'bg-[#1B4332]/10 border-[#1B4332] text-[#1B4332]';
                                else if (opt === selected) style = 'bg-red-50 border-red-400 text-red-800';
                                else style = 'opacity-40 border-[#9C6644]/10';
                            }
                            return (
                                <button key={opt} onClick={() => handleExAnswer(opt)}
                                    className={cn("p-4 rounded-sm border font-inter font-medium text-[14px] transition-all text-left", style)}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {selected && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className={cn("p-4 rounded-sm text-[13px] font-inter leading-relaxed border-l-4",
                                isCorrectAnswer ? "bg-[#1B4332]/5 border-[#1B4332] text-[#1B4332]" : "bg-red-50 border-red-400 text-red-800")}>
                            {isCorrectAnswer ? `Excellent ! La bonne réponse est "${ex.answer}".` : `La bonne réponse était "${ex.answer}".`}
                        </motion.div>
                    )}

                    {selected && (
                        <button onClick={handleExNext}
                            className="w-full py-4 bg-[#111111] text-[#F5EFE6] rounded-full font-inter font-bold uppercase tracking-[0.15em] text-[11px] shadow-lg hover:bg-[#1B4332] transition-colors">
                            {exIdx + 1 >= lesson.exercises.length ? `Terminer (+${lesson.xp} XP) 🏆` : 'Suivant →'}
                        </button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─── LANGUAGE MODULE COMPONENT ─────────────────────────────────────────────────
const LanguageModuleMode = ({ onBack }: { onBack: () => void }) => {
    const [selectedLang, setSelectedLang] = useState<typeof languageModules[0] | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [totalXP, setTotalXP] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleComplete = (xp: number) => {
        if (selectedLang && selectedLesson) {
            const key = `${selectedLang.id}-${selectedLesson.id}`;
            setCompletedLessons(prev => new Set([...prev, key]));
            setTotalXP(x => x + xp);
            setShowSuccess(true);
            setTimeout(() => { setShowSuccess(false); setSelectedLesson(null); }, 2000);
        }
    };

    if (selectedLesson && selectedLang) {
        return <LessonView lesson={selectedLesson} onComplete={handleComplete} onBack={() => setSelectedLesson(null)} />;
    }

    if (selectedLang) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedLang(null)} className="flex items-center gap-2 text-stone-500 hover:text-ivory-orange transition-colors font-bold">
                        <ArrowLeft size={18} /> Toutes les langues
                    </button>
                </div>

                <div className={cn("p-6 rounded-[2rem] text-white bg-gradient-to-br shadow-xl", selectedLang.color)}>
                    <h3 className="text-3xl font-black">{selectedLang.flag} {selectedLang.name}</h3>
                    <p className="text-white/80 mt-2 text-sm">{selectedLang.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <Star size={16} className="text-yellow-300 fill-yellow-300" />
                        <span className="font-bold text-sm">{totalXP} XP Totaux</span>
                    </div>
                </div>

                <AnimatePresence>
                    {showSuccess && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-green-500 text-white p-4 rounded-2xl text-center font-black text-lg">
                            🏆 Leçon complétée ! XP gagnés !
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    <h4 className="font-black text-lg text-stone-700 uppercase tracking-widest">Leçons disponibles</h4>
                    {selectedLang.lessons.map((lesson, idx) => {
                        const key = `${selectedLang.id}-${lesson.id}`;
                        const done = completedLessons.has(key);
                        const locked = idx > 0 && !completedLessons.has(`${selectedLang.id}-${selectedLang.lessons[idx - 1].id}`);
                        return (
                            <motion.button key={lesson.id} whileHover={!locked ? { scale: 1.02 } : {}} whileTap={!locked ? { scale: 0.98 } : {}}
                                onClick={() => !locked && setSelectedLesson(lesson)}
                                className={cn("w-full bg-white rounded-2xl p-6 shadow-lg border-2 flex items-center justify-between transition-all",
                                    done ? "border-green-300 bg-green-50" : locked ? "opacity-50 border-stone-100 cursor-not-allowed" : "border-stone-100 hover:border-ivory-orange")}>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{lesson.emoji}</span>
                                    <div className="text-left">
                                        <p className="font-black text-[#1A1A1A]">{lesson.title}</p>
                                        <p className="text-sm text-stone-400">{lesson.cards.length} mots · {lesson.exercises.length} exercices · +{lesson.xp} XP</p>
                                    </div>
                                </div>
                                {done ? <Award size={24} className="text-green-500" /> : locked ? <span className="text-xl">🔒</span> : <ChevronRight size={24} className="text-ivory-orange" />}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Language selection
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-ivory-orange transition-colors font-bold">
                    <ArrowLeft size={18} /> Académie
                </button>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#1A1A1A]">Choisir une Langue</h2>
                <p className="text-stone-500">Style Duolingo — Progressez leçon par leçon</p>
            </div>

            {totalXP > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
                    <Star size={24} className="text-yellow-500 fill-yellow-400" />
                    <div>
                        <p className="font-black text-yellow-800">Total XP : {totalXP}</p>
                        <p className="text-xs text-yellow-600">Continuez d'apprendre !</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {languageModules.map(lang => (
                    <motion.button key={lang.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLang(lang)}
                        className="w-full bg-white rounded-2xl p-6 shadow-lg border border-stone-100 flex items-center justify-between hover:border-ivory-orange transition-all group">
                        <div className="flex items-center gap-5">
                            <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg text-2xl", lang.color)}>
                                {lang.flag}
                            </div>
                            <div className="text-left">
                                <p className="font-black text-xl text-[#1A1A1A]">{lang.name}</p>
                                <p className="text-sm text-stone-400">{lang.lessons.length} leçons disponibles</p>
                                <p className="text-xs text-stone-300 mt-1">{lang.description.slice(0, 50)}...</p>
                            </div>
                        </div>
                        <ChevronRight size={24} className="text-stone-300 group-hover:text-ivory-orange transition-colors" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

// ─── MAIN ACADEMY EXPORT ───────────────────────────────────────────────────────
export type AcademyMode = 'menu' | 'quiz' | 'language';

interface AcademyProps {
    pseudo: string;
    onXPGained?: (xp: number) => void;
}

const Academy = ({ pseudo, onXPGained }: AcademyProps) => {
    const [mode, setMode] = useState<AcademyMode>('menu');

    return (
        <div className="space-y-8">
            {mode === 'menu' && (
                <div className="space-y-8 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                        <div className="trame-divider w-16 mx-auto mb-4" />
                        <h2 className="text-3xl font-philosopher font-bold text-[#111111]">Bonsoir, {pseudo} 👋</h2>
                        <p className="font-playfair italic text-[#9C6644] text-lg">Que voulez-vous apprendre aujourd'hui ?</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}
                            onClick={() => setMode('quiz')}
                            className="bg-[#F5EFE6] rounded-sm p-8 border border-[#9C6644]/20 flex flex-col sm:flex-row items-center gap-6 text-left hover:border-[#1B4332] transition-all group shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-[#F77F00] flex items-center justify-center text-[#111111] shadow-lg flex-shrink-0">
                                <MessageSquare size={28} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-philosopher font-bold text-[#111111] uppercase tracking-tight">Quiz de Sagesse</h3>
                                <p className="font-inter text-[#111111]/70 text-[14px] leading-relaxed">Testez vos connaissances sur les proverbes, traditions et langues.</p>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="px-2 py-0.5 bg-[#111111] text-[#F5EFE6] text-[9px] font-bold uppercase tracking-widest rounded-sm">{quizQuestions.length} Questions</span>
                                    <span className="px-2 py-0.5 bg-[#1B4332]/10 text-[#1B4332] text-[9px] font-bold uppercase tracking-widest rounded-sm">XP Bonus</span>
                                </div>
                            </div>
                        </motion.button>

                        <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}
                            onClick={() => setMode('language')}
                            className="bg-[#111111] rounded-sm p-8 border border-[#F5EFE6]/10 flex flex-col sm:flex-row items-center gap-6 text-left hover:border-[#F77F00] transition-all group shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-[#1B4332] flex items-center justify-center text-[#F5EFE6] shadow-lg flex-shrink-0 border border-[#F5EFE6]/20">
                                <Languages size={28} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-philosopher font-bold text-[#F5EFE6] uppercase tracking-tight">Modules de Langue</h3>
                                <p className="font-inter text-[#F5EFE6]/60 text-[14px] leading-relaxed">Apprenez Dioula, Baoulé, Bété, Sénoufo pas à pas.</p>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="px-2 py-0.5 bg-[#F5EFE6] text-[#111111] text-[9px] font-bold uppercase tracking-widest rounded-sm">4 Langues</span>
                                    <span className="px-2 py-0.5 bg-[#F77F00]/20 text-[#F77F00] text-[9px] font-bold uppercase tracking-widest rounded-sm">Style Duolingo</span>
                                </div>
                            </div>
                        </motion.button>
                    </div>

                    <div className="bg-[#F5EFE6] rounded-sm p-6 border border-[#9C6644]/10 shadow-sm relative overflow-hidden">
                        <div className="dot-texture absolute inset-0 opacity-5" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                            <Flame size={18} className="text-[#F77F00]" />
                            <p className="font-philosopher font-bold text-[#111111] uppercase tracking-widest text-xs">Conseil du Jour</p>
                        </div>
                        <p className="font-inter text-[#111111]/70 text-[13px] leading-relaxed relative z-10 italic">
                            "I ni sogoma" — Commencez votre journée avec le salut matinal en Dioula. Pratiquez 5 minutes par jour pour maîtriser une langue ivoirienne !
                        </p>
                    </div>
                </div>
            )}

            {mode === 'quiz' && <QuizMode onBack={() => setMode('menu')} />}
            {mode === 'language' && <LanguageModuleMode onBack={() => setMode('menu')} />}
        </div>
    );
};

export default Academy;
