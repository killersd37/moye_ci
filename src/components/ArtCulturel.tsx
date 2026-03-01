import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, MapPin, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

// Encode image paths (handles accents + spaces in filenames)
const img = (folder: string, file: string) =>
    `/data_mask/${folder}/${encodeURIComponent(file)}`;


// ─── TYPES ────────────────────────────────────────────────────────────────────
type Mask = {
    id: number;
    name: string;
    image: string;
    fonction: string;
    ceremonie: string;
    materiaux: string;
    symbolisme: string;
    region: string;
    anecdote: string;
};

type MaskModule = {
    id: string;
    ethnie: string;
    subtitle: string;
    emoji: string;
    gradient: string;
    colorText: string;
    colorBadge: string;
    intro: string;
    masks: Mask[];
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const maskModules: MaskModule[] = [
    {
        id: 'baoule',
        ethnie: 'Masques Baoulé',
        subtitle: 'Visages des Esprits de la Forêt',
        emoji: '🎭',
        gradient: 'from-amber-500 to-orange-500',
        colorText: 'text-amber-700',
        colorBadge: 'bg-amber-100 text-amber-700',
        intro: 'Les masques Baoulé comptent parmi les plus raffinés d\'Afrique de l\'Ouest. Chaque masque est un pont sacré entre le monde des vivants et celui des ancêtres (blolo). Leur esthétique idéalisée — traits sereins, cicatrices scarifiées, coiffures élaborées — reflète la conception baoulé de la beauté divine.',
        masks: [
            {
                id: 1,
                name: 'Masque Goli (Kpan)',
                image: img('baoule', 'baoulé 1.jpg.jpeg'),
                region: 'Centre de Côte d\'Ivoire, Bouaké',
                fonction: 'Masque de divertissement et de rituel funéraire de prestige',
                ceremonie: 'Utilisé lors des funérailles des personnalités importantes et des fêtes de fin d\'année. Le Goli apparaît en procession accompagné de tambours et de chants pour guider l\'âme du défunt vers le monde des ancêtres.',
                materiaux: 'Bois de fromager sculpté, pigments naturels (ocre rouge, kaolin blanc, charbon végétal), raphia tressé, plumes d\'oiseaux sacrés.',
                symbolisme: 'Les deux cornes représentent la puissance masculine et la fertilité. La bouche entrouverte signifie que le masque parle — que les ancêtres communiquent. La couleur rouge symbolise le sang de la vie, le blanc la pureté du monde des esprits.',
                anecdote: 'Le Goli ne peut sortir que quatre fois par an. Sa vue est traditionnellement interdite aux femmes enceintes. Le porteur du masque doit jeûner 24h avant la cérémonie pour que l\'esprit prenne possession de son corps.',
            },
            {
                id: 2,
                name: 'Masque Mblo (Portrait)',
                image: '/data_mask/baoule/Baulé 2.jpg.jpeg',
                region: 'Villages Baoulé, vallée du Bandama',
                fonction: 'Masque-portrait honorant une personne admirée pour sa beauté ou sa sagesse',
                ceremonie: 'Présenté lors de danses festives (do). Le porteur, un danseur virtuose, interprète les vertus de la personne honorée à travers ses gestes et sa danse. C\'est une forme de distinction suprême dans la société baoulé.',
                materiaux: 'Bois de cèdre finement poli à l\'huile de palme, laque végétale noire, coiffure sculptée parfois recouverte de métal repoussé.',
                symbolisme: 'Le front bombé symbolise l\'intelligence. Les yeux mi-clos expriment la sagesse et la paix intérieure. Les scarifications sur les joues représentent l\'appartenance clanique du sujet honoré.',
                anecdote: 'Le Mblo est l\'un des rares masques africains qui peut représenter une femme. Seuls les sculpteurs appartenant à la caste des forgerons sacrés sont autorisés à le créer — et uniquement après avoir reçu l\'accord de l\'esprit du bois.',
            },
            {
                id: 3,
                name: 'Masque Ndoma (de Guerre)',
                image: img('baoule', 'Baoulé 3.jpg.jpeg'),
                region: 'Pays Baoulé, région de Sakassou',
                fonction: 'Masque protecteur des guerriers, invoqué avant les batailles',
                ceremonie: 'Sorti lors des rituels de préparation à la guerre et des cérémonies d\'initiation masculines. Le chef de guerre le consultait pour obtenir la bénédiction des ancêtres avant chaque engagement militaire.',
                materiaux: 'Bois dur (iroko), peintures minérales rouge sang, noir charbon et blanc kaolin, cornes de bélier montées sur les côtés.',
                symbolisme: 'La forme en croissant et les cornes représentent la lune — protectrice des guerriers qui combattent dans l\'obscurité. Le rouge dominant incarne le courage et le sang versé pour le clan.',
                anecdote: 'Lors de la résistance contre la colonisation française (1891-1911), les guerriers Baoulé menés par la reine Abla Pokou utilisaient ces masques lors de cérémonies nocturnes pour se préparer spirituellement au combat. Plusieurs se trouvent aujourd\'hui dans des musées européens.',
            },
            {
                id: 4,
                name: 'Masque Kpan-Pre (de Beauté)',
                image: img('baoule', 'Baoulé 4.jpg.jpeg'),
                region: 'Basse Côte d\'Ivoire, pays Baoulé du sud',
                fonction: 'Masque cérémoniel féminin lié aux cultes de fertilité et de prospérité',
                ceremonie: 'Sorti lors des célébrations de récolte et des rituels de fertilité. Les femmes qui désirent un enfant dansent autour du masque en offrande. Sa présence lors d\'un mariage est censée garantir une union féconde.',
                materiaux: 'Bois léger de kapok, enduit de kaolin blanc, ornements de perles de verre colorées, broderies de coton et feuilles d\'or sur la coiffure.',
                symbolisme: 'La blancheur du masque symbolise la pureté, la fertilité et le lait maternel. La coiffure en forme de croissant représente la lune, symbole féminin universel dans la cosmogonie baoulé.',
                anecdote: 'Ce masque est l\'un des seuls qui peut être touché par les femmes et les enfants. Par opposition aux masques "d\'hommes" redoutés, il est considéré comme bienveillant et accueillant — la manifestation douce de l\'esprit de la nature.',
            },
        ],
    },

    {
        id: 'bete',
        ethnie: 'Masques Bété',
        subtitle: 'Puissance des Bois sacrés de l\'Ouest',
        emoji: '🌿',
        gradient: 'from-green-600 to-teal-600',
        colorText: 'text-green-700',
        colorBadge: 'bg-green-100 text-green-700',
        intro: 'Les masques Bété (groupe Krou) sont parmi les plus expressifs et dramatiques d\'Afrique. Caractérisés par leurs yeux tubulaires proéminents, leurs dents apparentes et leurs traits déformés, ils incarnent des forces surnaturelles brutes — à la fois terrifiantes et protectrices. Pour les Bété, un masque n\'est pas un objet mais un être vivant animé par un esprit de la forêt.',
        masks: [
            {
                id: 1,
                name: 'Masque Gla (de Justice)',
                image: img('bete', 'Masque Bété 1.jpg.jpeg'),
                region: 'Pays Bété, Gagnoa & Daloa',
                fonction: 'Tribunal sacré — le Gla incarne la justice et tranche les conflits',
                ceremonie: 'Convoqué lorsqu\'un crime ou un conflit grave déstabilise le village. Le porteur du Gla entre en transe et rend ses verdicts au nom des ancêtres. Sa décision est irrévocable et touche à la fois le monde spirituel et humain.',
                materiaux: 'Bois de fromager massif, pigments végétaux noirs et bruns, dents de sanglier incrustées dans la bouche, bambou pour les extensions latérales.',
                symbolisme: 'Les yeux proéminents en forme de tubes évoquent la vision de l\'au-delà — le Gla voit au-delà des mensonges humains. La bouche béante avec dents réelles signifie qu\'il peut dévorer symboliquement l\'injustice.',
                anecdote: 'Il est dit que pendant le verdict du Gla, même les chefs les plus puissants doivent se prosterner. Un seul regard soutenu de sa part suffit à confesser le coupable, qui ne peut résister à la puissance des ancêtres qui parlent à travers lui.',
            },
            {
                id: 2,
                name: 'Masque Guéré-Wobé (Guerrier)',
                image: img('bete', 'Masque Bété 2.jpg.jpeg'),
                region: 'Frontière Bété-Wè, région de Man',
                fonction: 'Masque guerrier de protection et d\'intimidation',
                ceremonie: 'Brandi lors des départs en guerre et à la prise de trophées de chasse. Présent aussi aux funérailles des grands guerriers pour escorter leur âme avec les honneurs dus aux héros.',
                materiaux: 'Bois dense (iroko), peinture rouge ocre et noire, incrustation de coquillages cauris sur le front, fibres de raphia tressées, plumes d\'aigle.',
                symbolisme: 'Le rouge sang dominant représente la valeur guerrière et le courage. Les cauris blancs sur le front symbolisent la richesse et la chance au combat. La forme asymétrique représente l\'imprévisibilité du guerrier — sa capacité à surprendre l\'ennemi.',
                anecdote: 'Les collectionneurs européens du XIXe siècle appelaient ces masques "masques de terreur". Lors de la colonisation, les soldats français rapportèrent que les guerriers Bété qui portaient ces masques semblaient insensibles à la douleur — effet attribué à la transe spirituelle induite par la cérémonie du masque.',
            },
            {
                id: 3,
                name: 'Masque Ngo (de la Forêt)',
                image: img('bete', 'Masque Bété 3.jpg.jpeg'),
                region: 'Forêt classée du Haut-Sassandra, Bété',
                fonction: 'Gardien de la forêt sacrée et protecteur de la chasse',
                ceremonie: 'Sorti lors des grandes chasses collectives et des cérémonies de début de plantation. Le Ngo est invoqué pour que la forêt accepte le prélèvement de gibier et de bois, et qu\'elle continue à être généreuse avec le village.',
                materiaux: 'Bois de kapokier sculpté à la herminette, peinture verte à base de plantes, cornes d\'antilope vraies, raphia imitant les feuilles de la forêt.',
                symbolisme: 'La forme organique et les cornes d\'antilope représentent la fusion entre l\'humain et la nature. Le vert végétal de la peinture symbolise la vie qui émerge de la forêt. Les cornes pointant vers le ciel signifient la connexion entre la terre et les esprits célestes.',
                anecdote: 'Selon la tradition Bété, la forêt n\'appartient pas aux hommes mais aux esprits qui l\'habitent. Le masque Ngo est littéralement la "face" de ces esprits — une fenêtre que les esprits de la forêt utilisent pour communiquer avec les humains lors des cérémonies de permission.',
            },
            {
                id: 4,
                name: 'Masque Zaouli (de Danse)',
                image: img('bete', 'Masque Btét 4.jpg.jpeg'),
                region: 'Pays Bété central, Gagnoa',
                fonction: 'Masque de divertissement et de célébration de la beauté féminine',
                ceremonie: 'Présenté lors des fêtes de récolte, des mariages et des cérémonies de bienvenue. La danse Zaouli est reconnue comme patrimoine culturel immatériel de l\'UNESCO depuis 2017.',
                materiaux: 'Bois léger sculpté finement, peintures multicolores vives (rouge, blanc, bleu, jaune), ornements de perles, coiffure en forme de croissant.',
                symbolisme: 'Contrairement aux autres masques Bété, le Zaouli est doux et souriant — il représente la jeune femme idéale, la beauté et la joie de vivre. Ses couleurs vives symbolisent la fertilité et l\'abondance de la nature.',
                anecdote: 'La danse Zaouli est l\'une des plus complexes d\'Afrique. Le porteur effectue des mouvements de pointe (sur les orteils) et des rotations à grande vitesse pendant des heures. Il est dit que celui qui maîtrise parfaitement le Zaouli a reçu la grâce des esprits de la danse.',
            },
        ],
    },

    {
        id: 'senoufo',
        ethnie: 'Masques Sénoufo',
        subtitle: 'Gardiens du Nord Sacré',
        emoji: '🦁',
        gradient: 'from-indigo-500 to-violet-600',
        colorText: 'text-indigo-700',
        colorBadge: 'bg-indigo-100 text-indigo-700',
        intro: 'Les masques Sénoufo du nord de la Côte d\'Ivoire sont intimement liés à la société secrète d\'initiation du Poro, l\'institution centrale de la vie sociale et spirituelle sénoufo. Ces masques combinent des éléments d\'animaux multiples — crocodile, hyène, calaos, antilope — pour incarner des forces cosmiques redoutables. Leur style géométrique et abstrait a profondément influencé l\'art moderne occidental.',
        masks: [
            {
                id: 1,
                name: 'Masque Kpelié',
                image: img('senoufo', 'Sénoufou 1.jpg.jpeg'),
                region: 'Korhogo, Nord de Côte d\'Ivoire',
                fonction: 'Masque du Poro — guide des âmes lors des funérailles des initiés',
                ceremonie: 'Apparu uniquement lors des cérémonies funéraires des membres du Poro et des rites d\'initiation masculins. Il guide l\'âme du défunt hors du monde des vivants et la protège pendant son voyage vers les ancêtres.',
                materiaux: 'Bois de karité fermement sculpté, peintures végétales (noir profond, blanc kaolin), parfois incrusté de cauris et de métal. Les projections latérales en forme de jambes sont taillées dans le même bloc.',
                symbolisme: 'Le visage ovale et les yeux en fentes représentent la sérénité de la mort acceptée. Les "jambes" latérales symbolisent la danse qui accompagne le passage vers l\'au-delà. Le crâne de calao au sommet représente l\'oiseau messager entre les mondes.',
                anecdote: 'Pablo Picasso et Henri Matisse ont explicitement cité le masque Kpelié comme une inspiration majeure du cubisme. La géométrie abstraite du Kpelié, vu lors d\'expositions coloniales à Paris au début du XXe siècle, a révolutionné l\'art occidental. Les Sénoufo apprirent cette influence seulement des décennies plus tard.',
            },
            {
                id: 2,
                name: 'Masque Wanyugo (Hyène Sacrée)',
                image: img('senoufo', 'Sénéfou 2.jpg.jpeg'),
                region: 'Villages du Poro, pays Sénoufo',
                fonction: 'Masque-casque de purification nocturne — chasse les esprits malfaisants',
                ceremonie: 'Sort uniquement la nuit lors des cérémonies de purification du village. Quand une épidémie, une malédiction ou une série de malheurs frappe la communauté, le Wanyugo est invoqué pour traverser les rues du village et en expulser les forces négatives.',
                materiaux: 'Bois d\'ébène très dense, dents de hyène et de sanglier incrustées, peinture rouge sang et noire, clochettes en bronze attachées pour produire un son lors du mouvement.',
                symbolisme: 'La hyène symbolise le passage entre la vie et la mort — elle consume les restes et purge la terre. Ses dents réelles sur le masque représentent ce pouvoir de dévorer l\'invisible et le maléfique. Le son des clochettes chasse les esprits malveillants.',
                anecdote: 'Lors du passage du Wanyugo, les femmes et les enfants sont enfermés dans leurs maisons, portes et fenêtres closes. Les sons de gongs et de cloches qui accompagnent le masque sont considérés comme la voix des ancêtres. Quiconque aperçoit le masque par inadvertance doit être purifié rituellement.',
            },
            {
                id: 3,
                name: 'Masque Nafiri (du Calao)',
                image: img('senoufo', 'Sénéfou 3.jpg.jpeg'),
                region: 'Touba, nord-ouest Côte d\'Ivoire',
                fonction: 'Masque du Poro lié à la fécondité et à la protection des récoltes',
                ceremonie: 'Sorti lors des fêtes des semailles et des récoltes. Le calao (oiseau sacré Sénoufo) est la monture des ancêtres — son masque est porté pour demander leur bienveillance sur les cultures et assurer l\'abondance alimentaire.',
                materiaux: 'Bois de manguier sculpté et brûlé pour le noircir, bec de calao sculpté en prolongement du masque, peinture blanche kaolin sur le front et autour des yeux.',
                symbolisme: 'Le calao dans la cosmogonie Sénoufo est le premier oiseau à avoir foulé la terre lors de la création. Porter son masque, c\'est s\'inscrire dans le temps des origines. Le bec proéminent représente la précision — savoir saisir le bon moment pour planter et récolter.',
                anecdote: 'Les tisserandes Sénoufo brodent systématiquement le motif du calao sur leurs tissus cérémoniels. Dans les concours de sculpture annuels organisés par le Poro, le masque Nafiri le mieux sculpté désigne le maître artisan qui jouira du plus grand prestige pour l\'année à venir.',
            },
            {
                id: 4,
                name: 'Masque Wambele (de l\'Initiation)',
                image: '/data_mask/senoufo/Sénoufou 4.jpg.jpeg',
                region: 'Boundiali, Ferkessédougou',
                fonction: 'Masque de passage — marqueur des étapes initiatiques du Poro',
                ceremonie: 'Présent lors de chaque étape d\'initiation du Poro, qui dure 21 ans au total (3 cycles de 7 ans). À la fin du troisième cycle, les initiés devenus "hommes complets" dansent face au Wambele pour marquer leur entrée dans la plénitude de la vie sociale.',
                materiaux: 'Bois de rônier taillé à la herminette, peinture géométrique bicolore (blanc et noir), antilope sculptée au sommet représentant la transformation, fibres de lin attachées.',
                symbolisme: 'La forme en losange du visage représente le cycle de la vie — naissance en haut, mort en bas, vie à droite, renaissance à gauche. Les antilopes au sommet symbolisent la grâce et la rapidité d\'esprit que doit acquérir l\'initié.',
                anecdote: 'Le Poro Sénoufo est l\'une des institutions éducatives les plus structurées d\'Afrique subsaharienne. Sur une durée de 21 ans, les initiés apprennent l\'agriculture, la chasse, la médecine des plantes, la cosmogonie et la sagesse politique de leur peuple. Le masque Wambele témoigne de chaque progression dans ce long chemin.',
            },
        ],
    },

    {
        id: 'yacouba',
        ethnie: 'Masques Yacouba (Dan)',
        subtitle: 'Danseurs des Montagnes de l\'Ouest',
        emoji: '🏔️',
        gradient: 'from-rose-500 to-red-600',
        colorText: 'text-rose-700',
        colorBadge: 'bg-rose-100 text-rose-700',
        intro: 'Les Yacouba (Dan) de la région de Man produisent des masques d\'une expressivité exceptionnelle. Contrairement à d\'autres traditions où le masque est redouté, chez les Dan le masque est d\'abord un ami — un "du" (esprit) qui choisit librement d\'entrer dans un masque. Chaque masque possède sa propre personnalité, ses propres désirs et ses propres fonctions. Les masques Dan sont aussi célèbres par la danse acrobatique sur échasse — inscrite à l\'UNESCO.',
        masks: [
            {
                id: 1,
                name: 'Masque Déanglé (de la Paix)',
                image: img('yacouba', 'yACOUBA 1.jpg.jpeg'),
                region: 'Man, nord-ouest de Côte d\'Ivoire',
                fonction: 'Médiateur sacré entre villages en conflit',
                ceremonie: 'Invoqué lorsque deux familles ou deux villages sont en dispute. Le Déanglé entre entre les parties adverses et, par sa seule présence, oblige à la trêve. Il préside ensuite la réconciliation et la distribution de nourriture en signe de fraternité retrouvée.',
                materiaux: 'Bois léger de fromager poli à l\'huile de palme, collerette de raphia tressé, perles de verre multicolores, tissu de coton blanc symbolisant la paix.',
                symbolisme: 'Le visage serein et les yeux mi-clos représentent la sagesse qui transcende le conflit. La bouche légèrement souriante signifie que la réconciliation est possible. Le blanc dominant rappelle la pureté des intentions nécessaire à la paix.',
                anecdote: 'Il est rapporté que même en pleine guerre, si le Déanglé surgissait entre deux armées, les combats devaient cesser immédiatement. Son autorité spirituelle dépassait celle des chefs de guerre. Les médiateurs de l\'ONU travaillant dans la région de Man lors des crises ivoiriennes des années 2000 reconnaissaient officieusement l\'influence pacificatrice de cette tradition.',
            },
            {
                id: 2,
                name: 'Masque Gle-Zo (de Course)',
                image: img('yacouba', 'Yacouba 2.jpg.jpeg'),
                region: 'Dan du Haut-Sassandra, Man',
                fonction: 'Masque de course rituelle et de compétition sportive sacrée',
                ceremonie: 'Présenté lors des compétitions de course organisées pour honorer les récoltes ou les visiteurs. Les jeunes hommes portant le masque rivalisent de vitesse sur des pistes naturelles. Le vainqueur est considéré comme favorisé des esprits pour l\'année entière.',
                materiaux: 'Bois de cèdre très léger taillé à la hache, peinture rouge et noire à base de plantes, fibres de coton tressées formant une coiffure haute et légère.',
                symbolisme: 'La forme allongée et les traits en mouvement perpétuel du masque représentent la vitesse. Le rouge sang foncé symbolise l\'énergie vitale du concurrent. Les lignes verticales sur les joues rappellent les scarifications des guerriers parfaits.',
                anecdote: 'Les porteurs du Gle-Zo s\'entraînent en secret pendant des mois avant les compétitions. Courir avec un masque qui restreint la vision tout en maintenant la grâce est considéré comme un exploit autant physique que spirituel. Les meilleurs coureurs étaient autrefois exemptés d\'impôt et pouvaient prétendre aux meilleures alliances matrimoniales.',
            },
            {
                id: 3,
                name: 'Masque Tankagle (d\'Échasse)',
                image: '/data_mask/yacouba/Yacouba 3.jpg.jpeg',
                region: 'Man et ses environs, région de Tonkpi',
                fonction: 'Masque de la danse sacrée sur échasses — pont entre humain et divin',
                ceremonie: 'Présenté lors des grandes cérémonies de récolte et des fêtes d\'intronisation des chefs. La danse sur échasses Yacouba est inscrite au patrimoine immatériel de l\'UNESCO depuis 2012. Les danseurs évoluent à 3-4 mètres de hauteur, symbole de leur élévation vers le monde des esprits.',
                materiaux: 'Bois d\'iroko massif pour résister aux chocs, peintures géométriques rouge et blanc, décoration de plumes d\'aigle royal, raphia de couleur sur les côtés.',
                symbolisme: 'La hauteur des échasses situe le danseur entre deux mondes — le terrestre et le céleste. Le masque-visage humain sur ce corps-oiseau représente la dualité fondamentale : être humain mais aspirer au divin. Les plumes d\'aigle ajoutent le pouvoir de s\'élever encore plus haut.',
                anecdote: 'Les danseurs sur échasses commencent leur apprentissage à l\'âge de 7 ans. Ils apprennent à marcher, puis courir, puis danser sur des tiges de bambou de plus en plus hautes. À Man, les meilleurs danseurs peuvent monter sur des épaules humaines tout en étant déjà sur leurs échasses — une pyramide humaine-masquée de près de 6 mètres.',
            },
            {
                id: 4,
                name: 'Masque Gunye Ge (de Fête)',
                image: img('yacouba', 'Yacouba 4.jpg.jpeg'),
                region: 'Dan du sud, Touba',
                fonction: 'Masque de divertissement et de célébration de la joie communautaire',
                ceremonie: 'Présenté lors des mariages, des naissances de jumeaux (événement extrêmement faste) et des retours de guerriers ou de chasseurs victorieux. Sa présence garantit que la fête sera mémorable et bénie.',
                materiaux: 'Bois léger poli, peinture bicolore rouge et noir, perles de verre de toutes couleurs cousues sur les bords, collier de cauris autour du cou.',
                symbolisme: 'Le sourire expressif du masque est rare dans l\'art africain — il signifie la joie partagée, le bonheur accessible à tous. Les perles multicolores représentent la diversité de la communauté célébrée. Les cauris symbolisent l\'abondance et la fertilité.',
                anecdote: 'Chez les Dan, les masques « joyeux » comme le Gunye Ge ont leur propre sens de l\'humour — le porteur peut improviser des sketches, se moquer gentiment des anciens ou mimer les étrangers, ce qui est une façon socialement acceptée de critiquer sans être puni. C\'est un des plus anciens exemples de satire sociale institutionnalisée au monde.',
            },
        ],
    },

    {
        id: 'gourounsi-autre',
        ethnie: 'Masques des Autres Ethnies',
        subtitle: 'Diversité des Traditions Masquées',
        emoji: '🌍',
        gradient: 'from-teal-500 to-cyan-600',
        colorText: 'text-teal-700',
        colorBadge: 'bg-teal-100 text-teal-700',
        intro: 'Au-delà des grandes traditions masquées, d\'autres peuples de Côte d\'Ivoire ont développé des pratiques artistiques uniques. Les Agni, les Abron, les Dida, les Wobé et d\'autres groupes enrichissent encore davantage le panorama artistique ivoirien. Ces masques, moins documentés mais tout aussi puissants, représentent l\'extraordinaire foisonnement culturel d\'un pays à plus de 60 ethnies.',
        masks: [
            {
                id: 1,
                name: 'Masque Wè-Wobé (Wè)',
                image: '/data_mask/bete/Masque Bété 4.jpg.jpeg',
                region: 'Frontière Bété-Wè, Guiglo',
                fonction: 'Masque de guerre et de protection communautaire',
                ceremonie: 'Utilisé par le peuple Wè lors des préparatifs de guerre et des cérémonies d\'entrée en territoire ennemi. Sa seule apparition dans un village adverse était censée provoquer la capitulation — l\'expression de terreur qu\'il inspire est sa première arme.',
                materiaux: 'Bois massif et lourd, yeux tubulaires saillants en métal, perles de verre sur le front, dents en métal, tissus et fibres végétales formant une "barbe" impressionnante.',
                symbolisme: 'Les yeux tubulaires représentent la vision pénétrante qui voit à travers les mensonges et les protections magiques ennemies. Les dents métalliques montrent la capacité à mordre — symboliquement détruire — les liens maléfiques. La barbe de fibres représente la sagesse accumulée des anciens guerriers.',
                anecdote: 'Des masques Wè-Wobé ont été exportés en Europe dès le XVIIe siècle par des marchands portugais. Dans les archives de la Compagnie des Indes, on trouve la mention de "fétiches terrifiants" achetés sur la côte ivoirienne — probablement des masques Wè. Certains sont conservés dans des collections privées en Europe sans que leurs propriétaires en connaissent l\'origine exacte.',
            },
            {
                id: 2,
                name: 'Masque Gbain (Dida)',
                image: '/data_mask/senoufo/Sénoufou 4.jpg.jpeg',
                region: 'Pays Dida, Lakota & Divo',
                fonction: 'Masque policier du village — maintien de l\'ordre social',
                ceremonie: 'Convoqué lors des litiges entre familles, des vols répétés ou des comportements antisociaux. Le Gbain enquête, juge et sanctionne au nom de la communauté. Une sanction prononcée par lui ne peut être contestée par aucun chef humain.',
                materiaux: 'Bois rouge-brun de cèdre sculpté, gomme végétale transparente laquant la surface, cheveux vegetaux tissés sur le sommet, peintures ocre et blanc.',
                symbolisme: 'La surface parfaitement lisse et polie du masque représente la clarté et la transparence de la justice. La coiffure végétale symbolise les racines de la loi — profondément ancrée dans la terre des ancêtres. L\'ocre de la peau représente le sang ivoirien partagé par tous les membres de la communauté.',
                anecdote: 'La pratique du Gbain comme institution pré-judiciaire a perduré jusqu\'à très récemment dans certains villages du pays Dida. Des études anthropologiques contemporaines montrent que les villages qui maintiennent la coutume du Gbain ont statistiquement moins de conflits non résolus et moins de criminalité que ceux qui l\'ont abandonnée.',
            },
            {
                id: 3,
                name: 'Masque Boloye (Abron)',
                image: '/data_mask/baoule/Baulé 2.jpg.jpeg',
                region: 'Bondoukou, nord-est, pays Abron',
                fonction: 'Masque de prospérité et d\'accueil lié aux relations commerciales',
                ceremonie: 'Sorti lors de l\'arrivée de grands marchands ou d\'alliés commerciaux importants. Le masque Boloye garantit la bonne foi de l\'hôte et place la transaction sous la protection des ancêtres. L\'invité est ainsi protégé pendant toute la durée de son séjour.',
                materiaux: 'Bois de fromager, doré à la feuille d\'or ou poudre d\'or (symbole de richesse Akan), coiffure ornée de symboles d\'or repoussé, rouge corail sur les lèvres.',
                symbolisme: 'L\'or omniprésent dans ce masque signifie l\'abondance et la réussite. Le rouge des lèvres représente la parole engagée — une promesse scellée sous le regard des ancêtres est inviolable. La forme généreuse et ouverte du visage exprime l\'accueil sans restriction.',
                anecdote: 'Les Abron, peuple Akan comme les Baoulé et les Agni, ont historiquement servi d\'intermédiaires commerciaux entre la côte et l\'intérieur. Leur maîtrise du commerce de l\'or leur donnait une grande influence — et le masque Boloye était leur "sceau royal" pour garantir l\'intégrité de leurs transactions.',
            },
            {
                id: 4,
                name: 'Masque Gou (Avikam)',
                image: '/data_mask/yacouba/Yacouba 3.jpg.jpeg',
                region: 'Grand-Lahou, peuples lagunaires',
                fonction: 'Masque aquatique — connexion avec les esprits des lagunes',
                ceremonie: 'Présent lors des cérémonies de pêche, des rituels de remerciement pour les bonnes prises et lors des funérailles des pêcheurs. Descend symboliquement dans l\'eau — l\'élément originel selon la cosmogonie Avikam — pour communiquer avec les esprits lacustres.',
                materiaux: 'Bois de palétuvier (résistant à l\'eau), peintures bleues et vertes évoquant les eaux des lagunes, coquillages marins incrustés, raphia imitant la végétation aquatique.',
                symbolisme: 'Le bleu dominant représente l\'eau — source de nourriture et lieu du monde intermédiaire où vivent les esprits entre deux incarnations. Les coquillages sont des messages des profondeurs, des trésors offerts par la mer pour confirmer la bienveillance des esprits aquatiques.',
                anecdote: 'Les peuples lagunaires de Côte d\'Ivoire ont développé une relation spirituelle unique avec l\'eau. Selon leur cosmogonie, les âmes des morts traversent les lagunes pour rejoindre le monde des ancêtres. Le masque Gou est le passeur — il facilite cette traversée et protège l\'âme pendant son voyage aquatique final.',
            },
        ],
    },
];

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
const MaskLightbox = ({ mask, ethnie, onClose }: { mask: Mask; ethnie: string; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
        >
            {/* Image */}
            <div className="relative">
                <img src={mask.image} alt={mask.name} className="w-full h-72 object-cover rounded-t-[2rem]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-[2rem]" />
                <button onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all">
                    <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4 space-y-1">
                    <h3 className="text-white text-xl font-black">{mask.name}</h3>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                        <MapPin size={12} /> <span>{mask.region}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-7 space-y-5">
                {[
                    { emoji: '🎭', label: 'Fonction', content: mask.fonction },
                    { emoji: '🥁', label: 'Cérémonie & Usage', content: mask.ceremonie },
                    { emoji: '🔮', label: 'Symbolisme', content: mask.symbolisme },
                    { emoji: '🪵', label: 'Matériaux', content: mask.materiaux },
                    { emoji: '✨', label: 'Anecdote', content: mask.anecdote },
                ].map((s, i) => (
                    <div key={i}>
                        <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">{s.emoji} {s.label}</p>
                        <p className="text-stone-700 leading-relaxed text-sm">{s.content}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    </motion.div>
);

// ─── MODULE DETAIL ─────────────────────────────────────────────────────────────
const ModuleDetail = ({ mod, onBack }: { mod: MaskModule; onBack: () => void }) => {
    const [selected, setSelected] = useState<Mask | null>(null);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-ivory-orange transition-colors font-bold">
                <ArrowLeft size={18} /> Tous les modules
            </button>

            {/* Banner */}
            <div className={cn("rounded-[2rem] p-8 text-white bg-gradient-to-br shadow-xl", mod.gradient)}>
                <span className="text-5xl">{mod.emoji}</span>
                <p className="text-white/70 text-xs font-black uppercase tracking-widest mt-3 mb-1">{mod.subtitle}</p>
                <h2 className="text-3xl font-black">{mod.ethnie}</h2>
                <p className="text-white/85 mt-3 text-sm leading-relaxed max-w-2xl">{mod.intro}</p>
            </div>

            {/* Masks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mod.masks.map(mask => (
                    <motion.div key={mask.id} whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.13)' }}
                        onClick={() => setSelected(mask)}
                        className="bg-white rounded-[1.5rem] shadow-lg border border-stone-100 overflow-hidden cursor-pointer group hover:border-ivory-orange/40 transition-all">
                        <div className="relative h-56 overflow-hidden">
                            <img src={mask.image} alt={mask.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white font-black text-base">{mask.name}</h4>
                                <div className="flex items-center gap-1 text-white/75 text-xs mt-0.5">
                                    <MapPin size={11} /> <span>{mask.region}</span>
                                </div>
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-full p-2">
                                <Eye size={16} className="text-white" />
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{mask.fonction}</p>
                            <span className="mt-3 inline-flex items-center gap-1 text-ivory-orange font-black text-xs uppercase tracking-widest">
                                Voir la fiche <ChevronRight size={13} />
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selected && <MaskLightbox mask={selected} ethnie={mod.ethnie} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </div>
    );
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
const ArtCulturel = () => {
    const [activeModule, setActiveModule] = useState<MaskModule | null>(null);

    if (activeModule) return <ModuleDetail mod={activeModule} onBack={() => setActiveModule(null)} />;

    const totalMasks = maskModules.reduce((acc, m) => acc + m.masks.length, 0);

    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-5xl md:text-6xl font-philosopher font-bold text-[#1A1A1A] tracking-tight">
                    Art des Masques
                </h2>
                <p className="text-lg font-inter text-stone-600 mt-3 max-w-2xl leading-relaxed">
                    Les masques ivoiriens sont des œuvres vivantes — chaque visage sculpté abrite un esprit, chaque cérémonie honore les ancêtres. Explorez les traditions masquées de nos grandes ethnies.
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-4">
                {[
                    { v: maskModules.length, l: 'Modules', e: '🗂️' },
                    { v: totalMasks, l: 'Masques', e: '🎭' },
                    { v: 4, l: 'Ethnies', e: '🌍' },
                    { v: 'UNESCO', l: 'Patrimoine', e: '🏛️' },
                ].map((s, i) => (
                    <div key={i} className="bg-white px-5 py-3 rounded-2xl shadow-md border border-stone-100 flex items-center gap-3">
                        <span className="text-xl">{s.e}</span>
                        <div>
                            <p className="font-black text-[#1A1A1A] text-base leading-none">{s.v}</p>
                            <p className="text-stone-400 text-xs font-semibold">{s.l}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Module cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maskModules.map((mod, idx) => (
                    <motion.div key={mod.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
                        onClick={() => setActiveModule(mod)}
                        className="bg-white rounded-[2rem] shadow-lg border border-stone-100 overflow-hidden cursor-pointer group hover:border-ivory-orange/30 transition-all">

                        <div className={cn("h-2 w-full bg-gradient-to-r", mod.gradient)} />

                        {/* Mask thumbnails */}
                        <div className="grid grid-cols-2 gap-0.5 h-44">
                            {mod.masks.slice(0, 4).map((mask, i) => (
                                <div key={i} className="overflow-hidden">
                                    <img src={mask.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>

                        <div className="p-5 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className={cn("text-xs font-black uppercase tracking-widest", mod.colorText)}>{mod.subtitle}</p>
                                    <h3 className="text-lg font-black text-[#1A1A1A] mt-0.5">{mod.ethnie}</h3>
                                </div>
                                <span className="text-2xl flex-shrink-0">{mod.emoji}</span>
                            </div>

                            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{mod.intro}</p>

                            <div className="flex items-center justify-between pt-1">
                                <span className={cn("text-xs font-black px-2 py-1 rounded-full", mod.colorBadge)}>
                                    {mod.masks.length} masques
                                </span>
                                <span className="flex items-center gap-1 text-ivory-orange font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                                    Explorer <ChevronRight size={14} />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quote footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-ivory-orange/10 to-ivory-green/10 rounded-[2rem] p-8 border border-stone-100 text-center">
                <p className="text-stone-700 font-philosopher text-xl italic leading-relaxed">
                    "Un masque ne cache pas le visage — il révèle l'âme de celui qui le porte."
                </p>
                <p className="text-stone-400 text-sm mt-3 font-semibold">— Sagesse Akan</p>
            </motion.div>
        </div>
    );
};

export default ArtCulturel;
