import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowLeft, Info, BookOpen, Pause, Play } from 'lucide-react';

// ─── Site data ────────────────────────────────────────────────────
export interface SiteData {
    slug: string;
    title: string;
    subtitle: string;
    ethnie: string;
    color: string;
    icon: string;
    images: string[];   // served from /moye/{slug}/{filename}
    description: { heading: string; paragraphs: string[] }[];
    infos: { label: string; value: string }[];
    keyFacts: string[];
}

export const CULTURAL_SITES_DATA: Record<string, SiteData> = {

    'bete': {
        slug: 'bete',
        title: 'Masque Bété Gla',
        subtitle: 'Galerie Historique Interactive',
        ethnie: 'Peuple Bété',
        color: '#8B4513',
        icon: '🎭',
        images: [
            'Image Princi.jpg',
            'Imae sé  4.jpg',
            'Image Sé 2.jpg',
            'Image sé 3.jpg',
            'Image sé 4.jpg',
            'image sé 5.jpg',
        ],
        description: [
            {
                heading: 'Identification',
                paragraphs: [
                    'Ce masque appartient au peuple Bété. Il s\'agit du masque "Gla" aussi orthographié Gré ou Glé, le masque de guerre et de justice le plus puissant de la tradition Bété.',
                ],
            },
            {
                heading: 'Description physique',
                paragraphs: [
                    'Structure et matériaux — Il est sculpté en bois dense (souvent bois noir ou ébène local), recouvert d\'une patine blanchâtre kaolin (argile blanche sacrée), et orné de nombreux clous métalliques disposés en rangées régulières sur les bandes horizontales. Ces clous sont une signature distincte des masques Bété.',
                    'Forme du visage — Le visage est déformé et monstrueux de façon intentionnelle : front bombé et proéminent divisé en sections horizontales, yeux en amande enfoncés ou exorbités, nez large et aplati prolongé verticalement, bouche ouverte avec dents visibles ou lèvres saillantes.',
                    'La segmentation horizontale — Le visage est divisé en bandes superposées, ce qui est une caractéristique unique et immédiatement reconnaissable des masques Gla Bété.',
                ],
            },
            {
                heading: 'Signification et rôle',
                paragraphs: [
                    'Le masque Gla est bien plus qu\'un objet artistique — c\'est une entité spirituelle vivante pour les Bété. Il était utilisé lors des cérémonies de guerre pour galvaniser les guerriers et intimider l\'ennemi, des rituels de justice pour trancher les conflits graves au sein de la communauté, des funérailles de grands guerriers et des cérémonies d\'initiation masculine.',
                    'Le masque est porté par un danseur initié, souvent un homme de grande stature, accompagné de musiciens. La danse est violente, puissante et impressionnante.',
                ],
            },
        ],
        infos: [
            { label: 'Peuple', value: 'Bété (Côte d\'Ivoire)' },
            { label: 'Type', value: 'Masque de guerre et de justice' },
            { label: 'Matériau', value: 'Bois, kaolin, clous métalliques, raphia' },
            { label: 'Fonction', value: 'Rituels, cérémonies, guerre, justice' },
        ],
        keyFacts: [
            'Segmentation horizontale marquée',
            'Clous métalliques en rangées régulières',
            'Patine blanchâtre de kaolin',
            'Barbe/collerette en raphia',
            'Expression monstrueuse et intimidante',
        ],
    },

    'baoule': {
        slug: 'baoule',
        title: 'Masque Baoulé Ndoma',
        subtitle: 'Galerie Historique Interactive',
        ethnie: 'Peuple Baoulé',
        color: '#C8960C',
        icon: '🎭',
        images: [
            'Princi.jpg',
            '6tir.jpg',
            'Quartri.jpg',
            'Sécondaire.jpg',
            'Terti.jpg',
        ],
        description: [
            {
                heading: 'Identification',
                paragraphs: [
                    'Ce masque appartient au peuple Baoulé, l\'une des ethnies les plus importantes de Côte d\'Ivoire, installée dans le centre du pays. Il s\'agit du masque Ndoma, un masque de portrait lié aux cérémonies de divertissement et d\'hommage aux personnes de grande valeur sociale.',
                ],
            },
            {
                heading: 'Description physique',
                paragraphs: [
                    'Forme générale — Le masque présente une forme ovale allongée et harmonieuse, avec un visage central noir brillant encadré d\'un large pourtour en bois clair de forme elliptique, décoré de motifs géométriques gravés. C\'est l\'une des signatures les plus reconnaissables du style Baoulé.',
                    'Le visage — Il est d\'une beauté classique et sereine, typique de l\'esthétique Baoulé : front haut et bombé orné de scarifications horizontales gravées, sourcils en arc finement tracés, yeux en amande mi-clos à l\'expression calme et introspective, nez fin et droit, bouche légèrement entrouverte aux lèvres sensuelles et bien dessinées.',
                ],
            },
            {
                heading: 'Signification et rôle',
                paragraphs: [
                    'Le masque Baoulé de ce type est avant tout un masque de beauté et d\'élégance. Il intervenait lors des fêtes de divertissement "Ndoma" pour célébrer des personnes admirées pour leur beauté, des cérémonies funéraires pour honorer les défunts de rang élevé, et des danses de prestige.',
                ],
            },
            {
                heading: 'Valeur patrimoniale',
                paragraphs: [
                    'Des œuvres similaires sont conservées au Musée du quai Branly – Jacques Chirac (Paris), au Metropolitan Museum of Art (New York) et au Musée des Civilisations de Côte d\'Ivoire (Abidjan).',
                ],
            },
        ],
        infos: [
            { label: 'Peuple', value: 'Baoulé (Centre Côte d\'Ivoire)' },
            { label: 'Type', value: 'Masque de portrait / divertissement' },
            { label: 'Nom', value: 'Ndoma' },
            { label: 'Style', value: 'Ovale, visage serein, scarifications' },
        ],
        keyFacts: [
            'Visage ovale noir brillant',
            'Encadrement en bois clair gravé',
            'Scarifications horizontales sur le front',
            'Expression sereine et esthétique',
            'Symétrie parfaite du visage',
        ],
    },

    'dan-kagle': {
        slug: 'dan-kagle',
        title: 'Masque Dan Kagle',
        subtitle: 'Galerie Historique Interactive',
        ethnie: 'Peuple Dan (Yacouba)',
        color: '#1A4A1A',
        icon: '🎭',
        images: [
            'Masque Principale.jpg',
            '23 3.jpg',
            'Sécded.jpg',
            'Sécond.jpg',
        ],
        description: [
            {
                heading: 'Identification',
                paragraphs: [
                    'Ce masque se nomme Kagle. C\'est le masque de guerre le plus puissant et le plus redouté du peuple Wé-Guéré (ou Kran/Grebo) de l\'ouest de la Côte d\'Ivoire. Le Kagle est considéré comme un masque "de feu" — littéralement un masque qui "dévore" ses ennemis.',
                    'Les crocs et défenses visibles sur ce masque sont sa marque de fabrique absolue — aucun autre masque africain ne présente cette configuration de défenses multiples de façon aussi caractéristique.',
                ],
            },
            {
                heading: 'Description physique',
                paragraphs: [
                    'Forme générale — Le masque présente une structure frontale rectangulaire et massive, avec un visage à la géométrie volontairement brutale et asymétrique, encadré d\'une couronne de tissu noir tressé et capitonné au sommet, et de raphia, fibres végétales sèches et cornes animales sur les côtés.',
                    'La couronne — Le sommet est ceint d\'un bourrelet de tissu noir épais et rembourré, cousu en segments superposés comme une couronne royale sombre. Des clous métalliques ponctuent cette bordure supérieure, renforçant l\'aspect guerrier de la pièce.',
                ],
            },
            {
                heading: 'Signification et rôle',
                paragraphs: [
                    'Ce masque est un instrument de pouvoir absolu dans sa société d\'origine. Il intervenait lors des préparatifs de guerre pour galvaniser les guerriers, des cérémonies de justice pour les crimes les plus graves, des rites d\'initiation masculine, et des exorcismes et purifications de villages.',
                ],
            },
            {
                heading: 'Valeur patrimoniale',
                paragraphs: [
                    'Des pièces comparables figurent dans les collections du Musée du quai Branly à Paris, du Smithsonian National Museum of African Art à Washington, et du Rietberg Museum à Zurich.',
                ],
            },
        ],
        infos: [
            { label: 'Peuple', value: 'Wé-Guéré / Dan (Yacouba)' },
            { label: 'Type', value: 'Masque de guerre et de feu' },
            { label: 'Matériau', value: 'Bois, métal, ivoire, tissu, fibres, cornes' },
            { label: 'Région', value: 'Ouest Côte d\'Ivoire' },
        ],
        keyFacts: [
            'Défenses et crocs caractéristiques',
            'Structure frontale rectangulaire massive',
            'Couronne de tissu noir capitonné',
            'Clous métalliques en bordure',
            'Expression de puissance et de terreur',
        ],
    },

    'dida': {
        slug: 'dida',
        title: 'Pagne Dida Gnogbwé',
        subtitle: 'Patrimoine Textile Sacré',
        ethnie: 'Peuple Dida',
        color: '#228B22',
        icon: '🧵',
        images: [
            'Page dida Im a Princi.jpg',
            'Image 3 papgne dida.jpg',
            'Image sécondaire.jpg',
        ],
        description: [
            {
                heading: 'Identification',
                paragraphs: [
                    'Ce que l\'on voit est un tissu rituel Dida, textile sacré produit par le peuple Dida, ethnie du sud-ouest de la Côte d\'Ivoire, dans la région de Lakota et Divo. Ce tissu est connu sous le nom de "Gnogbwé" ou simplement tissu Dida, l\'un des textiles africains les plus singuliers et les plus recherchés par les collectionneurs du monde entier.',
                ],
            },
            {
                heading: 'Description physique',
                paragraphs: [
                    'Texture et matière — Le tissu est tissé à partir de fibres végétales naturelles, très probablement du raphia ou du coton brut filé à la main. La trame est visible à l\'œil nu, grossière et organique, avec des irrégularités intentionnelles qui témoignent d\'un tissage entièrement artisanal.',
                    'Les couleurs — La palette chromatique joue sur des tons de terre brûlée, ocre rouille, brun caramel, bordeaux profond et noir intense. Ces teintes sont obtenues exclusivement à partir de colorants naturels extraits de plantes, d\'écorces et de minéraux locaux.',
                    'Les motifs — Les lignes sont réservées par résistance : le tissu est plissé, noué, cousu ou lié avant la teinture. Cette technique s\'appelle le tie-and-dye ou plissé-teinture, et les Dida en sont les maîtres incontestés en Afrique de l\'Ouest.',
                ],
            },
            {
                heading: 'Symbolisme',
                paragraphs: [
                    'Les lignes ondulantes évoquent l\'eau, les rivières et les forces de la nature — éléments centraux dans la cosmologie Dida. Les variations chromatiques entre clair et sombre symbolisent la dualité fondamentale : vie et mort, visible et invisible, monde des vivants et monde des esprits.',
                ],
            },
            {
                heading: 'Valeur patrimoniale',
                paragraphs: [
                    'Les tissus Dida authentiques sont aujourd\'hui extrêmement rares et précieux. Ils figurent dans les collections de grands musées comme le Musée du quai Branly à Paris et le Musée des Civilisations de Côte d\'Ivoire à Abidjan.',
                ],
            },
        ],
        infos: [
            { label: 'Peuple', value: 'Dida (Lakota, Divo)' },
            { label: 'Nom', value: 'Gnogbwé' },
            { label: 'Technique', value: 'Tie-and-dye / plissé-teinture' },
            { label: 'Matière', value: 'Raphia ou coton brut filé main' },
        ],
        keyFacts: [
            'Fibres végétales naturelles',
            'Teinture par résistance (plissé)',
            'Palette terre brûlée, ocre, bordeaux',
            'Colorants naturels d\'écorces et mineraux',
            'Maîtrise technique exceptionnelle',
        ],
    },

    'pont-liane': {
        slug: 'pont-liane',
        title: 'Pont de Lianes de Man',
        subtitle: 'Génie Civil Traditionnel',
        ethnie: 'Peuple Dan (Yacouba)',
        color: '#5C3A1E',
        icon: '🌉',
        images: [
            'pont_liane_ image princi.jpg',
            'encore liane.jpg',
            'Ségondaire.jpg',
            'image_1024.jfif',
        ],
        description: [
            {
                heading: 'Identification',
                paragraphs: [
                    'Cette photographie représente l\'un des trésors patrimoniaux les plus emblématiques de Côte d\'Ivoire : le célèbre Pont de Lianes de Man, situé dans la région des 18 Montagnes, à l\'ouest du pays. Ce pont suspendu entièrement construit en matériaux végétaux naturels est classé parmi les merveilles architecturales traditionnelles d\'Afrique de l\'Ouest.',
                ],
            },
            {
                heading: 'Description physique',
                paragraphs: [
                    'Structure générale — Le pont se présente comme un pont suspendu de type caténaire, s\'abaissant au centre avant de remonter vers les deux rives. Cette forme exploite les propriétés élastiques des lianes.',
                    'Les matériaux — L\'ensemble de la structure est constitué exclusivement de lianes tropicales : les grandes lianes maîtresses forment les câbles porteurs principaux, les lianes moyennes constituent le plancher et les garde-corps, et les petites lianes de liage servent à lier et consolider chaque jonction.',
                    'Le plancher — La surface de marche est formée de tiges de bambou ou de bois rond disposées transversalement et attachées une à une aux câbles porteurs avec des lianes plus fines.',
                ],
            },
            {
                heading: 'Histoire et Construction',
                paragraphs: [
                    'Ces ponts sont construits et entretenus par le peuple Dan (Yacouba), les maîtres tisserands et constructeurs de cette région montagneuse. Leur histoire remonte à plusieurs siècles, bien avant la colonisation européenne. Le pont nécessite une réfection partielle annuelle et une reconstruction complète tous les 5 à 10 ans.',
                ],
            },
            {
                heading: 'Reconnaissance internationale',
                paragraphs: [
                    'Le pont de lianes de Man est aujourd\'hui l\'un des sites touristiques les plus visités de Côte d\'Ivoire. Il fait l\'objet de démarches pour son inscription au Patrimoine Mondial de l\'UNESCO au titre du patrimoine culturel immatériel.',
                ],
            },
        ],
        infos: [
            { label: 'Lieu', value: 'Man, Région des 18 Montagnes' },
            { label: 'Peuple', value: 'Dan (Yacouba)' },
            { label: 'Matériaux', value: 'Lianes tropicales, bambou' },
            { label: 'Longévité', value: 'Reconstruction tous les 5 à 10 ans' },
        ],
        keyFacts: [
            'Structure caténaire en lianes naturelles',
            'Aucun matériau industriel',
            'Câbles porteurs de lianes tressées',
            'Traverses de bambou pour le plancher',
            'Cérémonie de consécration spirituelle',
        ],
    },
};

// ─────────────────────────────────────────────────────────────────
// CULTURAL SITE VIEWER COMPONENT
// ─────────────────────────────────────────────────────────────────
interface Props {
    slug: string;
    onBack: () => void;
}

export const CulturalSiteViewer: React.FC<Props> = ({ slug, onBack }) => {
    const site = CULTURAL_SITES_DATA[slug];
    const [imgIndex, setImgIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'desc' | 'infos'>('desc');
    const [slideshow, setSlideshow] = useState(false);

    // Image URLs served from Express
    const imgUrl = (filename: string) => `/moye/${slug}/${encodeURIComponent(filename)}`;

    // Slideshow
    useEffect(() => {
        if (!slideshow || !site) return;
        const id = setInterval(() => {
            setImgIndex(i => (i + 1) % site.images.length);
        }, 3000);
        return () => clearInterval(id);
    }, [slideshow, site]);

    if (!site) {
        return (
            <div className="text-center py-20">
                <p className="font-philosopher text-2xl text-[#1C1410]">Site introuvable</p>
                <button onClick={onBack} className="mt-4 text-[#FF8C00] font-inter text-sm underline">← Retour</button>
            </div>
        );
    }

    const prev = () => setImgIndex(i => (i - 1 + site.images.length) % site.images.length);
    const next = () => setImgIndex(i => (i + 1) % site.images.length);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-xl mx-auto pb-28 space-y-5"
        >
            {/* ── Header ─────────────────────────────── */}
            <div className="space-y-1">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 font-inter text-xs text-stone-400 hover:text-[#FF8C00] transition-colors mb-2"
                >
                    <ArrowLeft size={13} /> Retour au scanner
                </button>
                <div className="kente-stripe h-[3px] w-14 rounded-full" />
                <h2 className="text-4xl font-philosopher font-bold text-[#1C1410] leading-tight">
                    {site.title}
                </h2>
                <p className="font-inter text-stone-400 text-sm">{site.ethnie}</p>
            </div>

            {/* ── Gallery ────────────────────────────── */}
            <div
                className="relative rounded-2xl overflow-hidden shadow-xl"
                style={{ background: site.color }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={imgIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={imgUrl(site.images[imgIndex])}
                        alt={`${site.title} — ${imgIndex + 1}`}
                        className="w-full h-72 object-cover"
                    />
                </AnimatePresence>

                {/* Counter badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white font-inter text-xs px-2.5 py-1 rounded-full">
                    {imgIndex + 1} / {site.images.length}
                </div>

                {/* Nav arrows */}
                <button onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all active:scale-90">
                    <ChevronLeft size={18} />
                </button>
                <button onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all active:scale-90">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Dots + slideshow */}
            <div className="flex items-center justify-between px-1">
                <div className="flex gap-1.5">
                    {site.images.map((_, i) => (
                        <button key={i} onClick={() => setImgIndex(i)}
                            className="rounded-full transition-all"
                            style={{
                                width: i === imgIndex ? 20 : 8,
                                height: 8,
                                background: i === imgIndex ? site.color : '#E0D5C9',
                            }}
                        />
                    ))}
                </div>
                <button onClick={() => setSlideshow(s => !s)}
                    className="flex items-center gap-1.5 font-inter text-xs text-stone-400 hover:text-[#FF8C00] transition-colors">
                    {slideshow ? <Pause size={13} /> : <Play size={13} />}
                    {slideshow ? 'Pause' : 'Diaporama'}
                </button>
            </div>

            {/* ── Tabs ───────────────────────────────── */}
            <div className="card rounded-2xl overflow-hidden">
                {/* Tab headers */}
                <div className="flex border-b border-[#F0E6D3]">
                    <button onClick={() => setActiveTab('desc')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-inter text-sm font-medium transition-all ${activeTab === 'desc'
                                ? 'text-[#1C1410] border-b-2 border-[#FF8C00]'
                                : 'text-stone-400'
                            }`}>
                        <BookOpen size={14} /> Description
                    </button>
                    <button onClick={() => setActiveTab('infos')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-inter text-sm font-medium transition-all ${activeTab === 'infos'
                                ? 'text-[#1C1410] border-b-2 border-[#FF8C00]'
                                : 'text-stone-400'
                            }`}>
                        <Info size={14} /> Informations
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'desc' && (
                        <motion.div key="desc" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-5 space-y-5">
                            {site.description.map((section, i) => (
                                <div key={i}>
                                    <h3 className="font-philosopher font-bold text-[#1C1410] text-base mb-2"
                                        style={{ color: site.color }}>
                                        {section.heading}
                                    </h3>
                                    {section.paragraphs.map((p, j) => (
                                        <p key={j} className="font-inter text-stone-500 text-sm leading-relaxed mb-2">{p}</p>
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'infos' && (
                        <motion.div key="infos" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-5 space-y-4">
                            {/* Key data table */}
                            <div className="space-y-2">
                                {site.infos.map((info, i) => (
                                    <div key={i} className="flex items-start gap-3 py-2 border-b border-[#F7F0E8] last:border-0">
                                        <span className="font-inter text-xs font-semibold text-stone-400 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">
                                            {info.label}
                                        </span>
                                        <span className="font-inter text-stone-600 text-sm">{info.value}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Key facts */}
                            <div>
                                <p className="font-inter text-xs font-semibold text-[#B8622A] uppercase tracking-widest mb-3">
                                    Clés d'identification
                                </p>
                                <div className="space-y-2">
                                    {site.keyFacts.map((fact, i) => (
                                        <div key={i} className="flex items-center gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: site.color }} />
                                            <p className="font-inter text-stone-500 text-sm">{fact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quote footer */}
            <div className="text-center py-4 space-y-2">
                <div className="kente-stripe h-[1px] opacity-30" />
                <p className="font-display italic text-xl text-[#4A2E1A] pt-3">
                    "La culture est la mémoire vivante d'un peuple."
                </p>
                <p className="text-stone-400 font-inter text-xs">— Patrimoine de Côte d'Ivoire</p>
            </div>
        </motion.div>
    );
};
