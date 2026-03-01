import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowLeft,
  MapPin,
  Ghost,
  Utensils,
  Landmark,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Ethnie {
  id: string;
  nom: string;
  region: string;
  description: string;
  histoire: string;
  image_url: string;
  localite?: string;
  culture_rites?: string;
  gastronomie?: { image: string; name: string; desc: string }[];
  objets_culte?: { name: string; image: string; desc: string }[];
}

const MOCK_ETHNIES: Ethnie[] = [
  {
    id: '1',
    nom: 'Agni',
    region: 'Est',
    description: 'Peuple de tradition royale, les Agni sont réputés pour leur organisation sociale complexe.',
    histoire: 'Originaires du Ghana actuel, les Agni ont migré vers l\'Est de la Côte d\'Ivoire sous la pression des conflits Ashanti. Ils ont fondé des royaumes puissants comme l\'Indénié, préservant des traditions séculaires de noblesse et de diplomatie.',
    localite: 'Régions de l\'Indénié-Djuablin et du Sud-Comoé (Abengourou, Aboisso).',
    culture_rites: 'La fête de l\'Abissa à Grand-Bassam est un moment de critique sociale et de purification. Le port du pagne Kita est un signe de noblesse.',
    gastronomie: [
      { image: '/image/agni/Spécialité culinaire 1.jpg', name: 'Sauce M Gbotta', desc: 'SAUCE M GBOTTA EN PAYS AGNI ACCOMPAGNE DE FOUTOU DE BANNANE PLANTAIN' },
      { image: '/image/agni/Spécialité culinaire 2.jpg', name: 'CREVETTE D EAU DOUCE', desc: 'ETRE AQUATIQUE.' },
      { image: '/image/agni/Spécialité culinaire 3.jpg', name: 'Sauce Graine', desc: 'Sauce riche aux graine et épices locales.' }
    ],
    objets_culte: [
      { name: 'Chaise Royale', image: '/image/agni/Chaise Royale.jpg', desc: 'Siège d\'apparat du roi, symbole de pouvoir.' },
      { name: 'Poids à Or', image: '/image/agni/Poids à Or.jpg', desc: 'Petites pesées pour le commerce de l\'or.' },
      { name: 'Statuette Mma', image: '/image/agni/Statuette Mma.jpg', desc: 'Figurine de fertilité et de protection familiale.' },
      { name: 'Couronne', image: '/image/agni/Couronne.jpg', desc: 'Couronne royale ornée de perles et d\'or.' }
    ],
    image_url: '/image/agni/culture agni.jpg'
  },
  {
    id: '2',
    nom: 'Baoulé',
    region: 'Centre',
    description: 'L\'un des groupes ethniques les plus importants, connu pour son artisanat.',
    histoire: 'L\'exode des Baoulé est mené par la Reine Abla Pokou au XVIIIe siècle. Pour traverser le fleuve Comoé, elle dut sacrifier son fils unique, s\'écriant "Ba-ouli" (l\'enfant est mort), donnant ainsi son nom au peuple.',
    localite: 'Principalement dans le V-Baoulé (Bouaké, Yamoussoukro).',
    culture_rites: 'Le Goli est une danse de réjouissance très populaire. Ils pratiquent également le culte des ancêtres.',
    gastronomie: [
      { image: '/image/baoulé/specilaite1.jpg', name: 'Kedjenou', desc: 'Ragoût de poulet cuit à l\'étouffée avec légumes.' },
      { image: '/image/baoulé/specilalite2.jpg', name: 'Sauce GNANGAN', desc: 'Le gnangnan est une petite aubergine amère africaine séchée, très utilisée dans la cuisine ouest-africaine. Il est prisé pour son goût amer et intense, qui équilibre les plats en leur apportant profondeur et authenticité. Ce fruit séché est un ingrédient essentiel des sauces africaines traditionnelles.' },
      { image: '/image/baoulé/specialité3.jpg', name: 'Une sauce baoulé, appelé "nan moukoun tro', desc: '" c\'est fait à base de feuilles de fromager séché, souvent accompagné de poissons.' }
    ],
    objets_culte: [
      { name: 'Masque Goli', image: '/image/baoulé/Masque Goli.jpg', desc: 'Masque sacré pour les cérémonies de célébration.' },
      { name: 'Pagne Baoulé', image: '/image/baoulé/Pagne Baoulé.jpg', desc: 'Tissu traditionnel aux motifs géométriques colorés.' }
    ],
    image_url: '/image/baoulé/culture baoule.jpg'
  },
  {
    id: '3',
    nom: 'Senoufo',
    region: 'Nord-Ouest',
    description: 'Peuple d\'artistes et de cultivateurs, les Senoufo sont réputés pour leur sculpture traditionnelle et leurs rituels sacrés.',
    histoire: 'Les Senoufo sont un peuple ancien installé au nord-ouest de la Côte d\'Ivoire, au Mali et au Burkina Faso. Ils ont développé une riche culture basée sur des sociétés initiatiques secrètes (le Poro) qui transmettent les traditions et les savoirs de génération en génération. Leur art sculptural est mondialement reconnu.',
    localite: 'Régions du Worodougou et du Tchologo (Odienné, Minignan, Korhogo).',
    culture_rites: 'Le Poro est une société d\'initiation masculine secrète. Les masques senoufo sont utilisés dans des cérémonies d\'initiation et de passage. Les danses rituelles accompagnent chaque étape importante de la vie.',
    gastronomie: [
      { image: '/image/senoufo/specialité 1.jpg', name: 'Foufou de Manioc', desc: 'Pâte épaisse à base de manioc pilé, plat de base très nourrissant.' },
      { image: '/image/senoufo/specialite 2.jpg', name: 'Sauce d\'Arachide Senoufo', desc: 'Sauce riche aux arachides, tomates et épices traditionnelles.' },
      { image: '/image/senoufo/specialite 3.jpg', name: 'Couscous de Mil', desc: 'Couscous traditionnel à base de mil, accompagnement de fête.' }
    ],
    objets_culte: [
      { name: 'Masque Senoufo', image: '/image/senoufo/masque Senoufo.jpg', desc: 'Masque rituel utilisé dans les initiations du Poro.' },
      { name: 'Statuette Senoufo', image: '/image/senoufo/statuette senoufo.jpg', desc: 'Figure sculptée symbole de pouvoir et de fertilité.' },
      { name: 'Tambour Sacré', image: '/image/senoufo/tambour sacre.jpg', desc: 'Instrument percussif rituel pour les cérémonies.' },
      { name: 'Pagne Indigo', image: '/image/senoufo/pagne indigo.jpg', desc: 'Tissu teint à l\'indigo, vêtement traditionnel prestigieux.' }
    ],
    image_url: '/image/senoufo/culture senoufo.jpg'
  },
  {
    id: '4',
    nom: 'Bété',
    region: 'Centre-Ouest',
    description: 'Peuple guerrier et cultivateur, les Bété sont connus pour leurs masques sacrés Gla et leur sens aigu de la justice communautaire.',
    histoire: 'Les Bété sont un peuple autochtone du centre-ouest de la Côte d\'Ivoire, appartenant au grand groupe krou. Figures de résistance face à la colonisation française, ils ont conservé une organisation sociale fondée sur le village et le lignage. Leur chef le plus célèbre, Gbon Coulibaly, incarne leur farouche attachement à la liberté. Leur culture orale, leurs masques et leurs rites initiatiques en font l\'un des peuples les plus emblématiques du patrimoine ivoirien.',
    localite: 'Régions du Gôh et du Haut-Sassandra (Gagnoa, Daloa, Issia, Soubré).',
    culture_rites: 'Le masque Gla est l\'élément central de la vie rituelle Bété. Il intervient lors des funérailles, des conflits et des cérémonies d\'initiation. La danse Didiga est réservée aux hommes ayant accompli des exploits guerriers. Les Bété pratiquent également le culte des ancêtres (Kouli) pour maintenir l\'équilibre entre les vivants et les esprits.',
    gastronomie: [
      { image: '/image/bété/Gastronomie 1.webp', name: 'Rizz sauce feuilles', desc: 'Riz sauce feuilles.' },
      { image: '/image/bété/Gastronomie 2.jpg', name: 'Le loko-soukouè', desc: 'accompagné de sauce graine.' },
      { image: '/image/bété/Gastronomie 3.jpg', name: 'Sauce Graine', desc: 'Sauce onctueuse aux graines de palme, accompagnée de riz ou de foutou banane. Plat de fête par excellence.' }
    ],
    objets_culte: [
      { name: 'Masque Gla', image: '/image/bété/masque bété.jpg', desc: 'Masque sacré des cérémonies funéraires et de justice. Son apparition impose silence et respect.' },
      { name: 'Masque Secondaire', image: '/image/bété/masque scondaire.jpg', desc: 'Masque d\'accompagnement du Gla lors des grandes cérémonies.' },
      { name: 'Masque de Danse', image: '/image/bété/masque de danse.jpg', desc: 'Masque utilisé lors des danses rituelles mettant en scène les esprits protecteurs.' }
    ],
    image_url: '/image/bété/culture bété.jpg'
  },
  {
    id: '5',
    nom: 'Yacouba',
    region: 'Ouest',
    description: 'Également appelés Dan, les Yacouba sont réputés pour leurs masques Kagle et leurs danseurs de pointe d\'une agilité légendaire.',
    histoire: 'Les Yacouba (ou Dan) sont établis dans les forêts montagneuses de l\'Ouest ivoirien et du Libéria voisin. Leur nom "Dan" signifie "être humain" dans leur langue. Ce peuple de cultivateurs et de chasseurs a développé l\'un des systèmes artistiques les plus raffinés d\'Afrique de l\'Ouest. Leurs masques portent des messages spirituels et sociaux profonds. La ville de Man, au pied des montagnes, est considérée comme leur capitale culturelle.',
    localite: 'Région du Tonkpi (Man, Danané, Biankouma) et régions frontalières avec le Libéria.',
    culture_rites: 'Le masque Kagle (ou Guéré) est un masque de joie utilisé lors des fêtes de récolte et de paix. Le "Fakié" est le rite d\'initiation masculin qui marque le passage à l\'âge adulte. Les Yacouba sont également célèbres pour leurs funambules masqués, qui marchent sur des échasses à grande hauteur lors des festivals. La société secrète "Poro" régit la vie sociale et spirituelle.',
    gastronomie: [
      { image: '/image/yacouba/Gastronomie 1.jpg', name: 'Grenouille braisée', desc: 'Grenouille braisée avec épices locales.' },
      { image: '/image/yacouba/Gastronomie 2.jpg', name: 'Kplé Ba ou sauce longaire', desc: 'Accompagné de riz ou de foutou banane. Plat de fête par excellence.' },
      { image: '/image/yacouba/Gastronomie  3.jpg', name: 'Kplé', desc: 'Sauce  yacouba.' }
    ],
    objets_culte: [
      { name: 'Masque Kagle', image: '/image/yacouba/masque kagle.gif', desc: 'Masque anthropomorphe du peuple Dan, porteur de messages de paix et de joie collective.' },
      { name: 'Masque de Fête', image: '/image/yacouba/masque de fêtes.jpg', desc: 'Masque de célébration porté lors des fêtes de récolte et des mariages.' },
      { name: 'Masque Initiatique', image: '/image/yacouba/masque initiatique.jpg', desc: 'Masque réservé aux cérémonies d\'initiation masculine du Poro.' }
    ],
    image_url: '/image/yacouba/peuple yacouba.jpg'
  },
  {
    id: '6',
    nom: 'Abron',
    region: 'Est',
    description: 'Peuple Akan du royaume du Gyaman, les Abron sont réputés pour leur rôle dans le commerce de l\'or et leurs traditions royales.',
    histoire: 'Les Abron (ou Bono) sont un peuple Akan installé à l\'est de la Côte d\'Ivoire et au Ghana. Ils ont fondé le royaume du Gyaman (Bondoukou) et ont longtemps dominé les routes commerciales de l\'or. Leur culture partage de nombreux traits avec les Baoulé et les Agni : organisation en royaumes, poids à peser l\'or, et cérémonies en l\'honneur des ancêtres.',
    localite: 'Région du Gontougo (Bondoukou, Tanda, Bouna).',
    culture_rites: 'Le masque Boloye est un emblème royal utilisé pour garantir l\'intégrité des transactions. Les Abron pratiquent des cérémonies de purification et des fêtes en l\'honneur des chefs et des ancêtres. Le tissage du pagne et l\'orfèvrerie occupent une place centrale dans leur patrimoine.',
    gastronomie: [
      { image: '/image/Abron/gastronomie 1.JPG', name: 'Foutou banane', desc: '' },
      { image: '/image/Abron/gastronomie 2.jpg', name: 'Kedjenou', desc: '' },
      { image: '/image/Abron/gastronnomie 3.jpg', name: 'Sauce graine', desc: '' }
    ],
    objets_culte: [
      { name: 'Poids à or', image: '/image/Abron/objets cultes 1.jpg', desc: '' },
      { name: 'Masque Boloye', image: '/image/Abron/objets cultes2.jpg', desc: '' }
    ],
    image_url: '/image/Abron/peuple abron.jpg'
  },
  {
    id: '7',
    nom: 'Dida',
    region: 'Sud-Ouest',
    description: 'Peuple réputé pour le tissu Gnogbwé, un textile sacré parmi les plus singuliers d\'Afrique.',
    histoire: 'Les Dida font partie du groupe krou et sont installés dans la région de Lakota et Divo. Ils sont mondialement connus pour leur tissu rituel dit "Gnogbwé" ou tissu Dida : un textile raphia à motifs géométriques, teint à l\'indigo et au cachou, recherché par les collectionneurs. Le tissage est une activité réservée aux femmes et transmise de génération en génération.',
    localite: 'Régions de Lakota, Divo, Fresco (Sud-Ouest).',
    culture_rites: 'Le Gnogbwé est porté lors des cérémonies importantes : funérailles, intronisation, mariages. Les Dida pratiquent des rites initiatiques et des danses masquées. La société secrète Abodan joue un rôle dans la régulation sociale et la transmission des savoirs.',
    gastronomie: [
      { image: '/image/Dida/gastronomie 1.jpg', name: 'Riz sauce feuilles', desc: '' },
      { image: '/image/Dida/gastronomie 2.jpg', name: 'Sauce graine', desc: '' },
      { image: '/image/Dida/gastronomie 3.jpg', name: 'Foutou igname', desc: '' }
    ],
    objets_culte: [
      { name: 'Tissu Gnogbwé', image: '/image/Dida/objets cultes 1.jpg', desc: '' },
      { name: 'Masque Dida', image: '/image/Dida/objet cultes 2.jpg', desc: '' }
    ],
    image_url: '/image/Dida/peuple dida.jpg'
  },
  {
    id: '8',
    nom: 'Ebrié',
    region: 'Lagunes',
    description: 'Peuple lagunaire d\'Abidjan et des environs, gardien des traditions de l\'Abissa et du pagne Kita.',
    histoire: 'Les Ebrié (ou Tchaman) sont un peuple des lagunes, installé sur les rives de la lagune Ébrié et dans le Grand Abidjan. Ils ont accueilli la construction de la capitale économique et restent les gardiens de sites sacrés et de fêtes majeures comme l\'Abissa. Leur organisation en villages (Abou, Adjamé, etc.) et leur lien à l\'eau et à la pêche structurent leur identité.',
    localite: 'Grand Abidjan, Grand-Bassam, lagune Ébrié (Sud-Est).',
    culture_rites: 'L\'Abissa est la fête annuelle de critique sociale, de purification et de renouveau. Le port du pagne Kita (rayé) est un signe de noblesse et d’appartenance. Les Ebrié pratiquent des rites liés à l’eau et aux génies des lagunes.',
    gastronomie: [
      { image: '/image/Ebrié/gastonomie 1.jpg', name: 'Foutou banane et sauce graine', desc: '' },
      { image: '/image/Ebrié/gastonomie 1.jpg', name: 'Poisson braisé', desc: '' },
      { image: '/image/Ebrié/gastonomie 1.jpg', name: 'Kedjenou', desc: '' }
    ],
    objets_culte: [
      { name: 'Pagne Kita', image: '/image/Ebrié/objes cultes 1.jpg', desc: '' },
      { name: 'Objet rituel lagunaire', image: '/image/Ebrié/objets cultes 2.jpg', desc: '' }
    ],
    image_url: '/image/Ebrié/peuple ebrié.jpg'
  },
  {
    id: '9',
    nom: 'Gouro',
    region: 'Centre-Ouest',
    description: 'Peuple de la forêt réputé pour ses masques Zaouli et son riche patrimoine sculptural.',
    histoire: 'Les Gouro (ou Guro) sont installés au centre-ouest de la Côte d\'Ivoire, entre les Baoulé et les Bété. Leur art masqué, en particulier le masque Zaouli et les masques de danse, est reconnu au niveau national et international. Le Zaouli a été inscrit au patrimoine culturel immatériel de l\'UNESCO. Ils sont cultivateurs et gardent une forte tradition de sociétés initiatiques.',
    localite: 'Régions du Béré et du Haut-Sassandra (Zuénoula, Séguela, Mankono).',
    culture_rites: 'Le masque Zaouli est présenté lors des fêtes de récolte, des mariages et des cérémonies de bienvenue. Les Gouro ont des sociétés secrètes et des rites d\'initiation. Leurs masques zoomorphes et anthropomorphes accompagnent les danses et les réconciliations.',
    gastronomie: [
      { image: '/image/Gouro/gastronomie 1.jpg', name: 'Foutou banane', desc: '' },
      { image: '/image/Gouro/gastronomie 2.jpg', name: 'Sauce graine', desc: '' },
      { image: '/image/Gouro/gastronomie 1.jpg', name: 'Kedjenou', desc: '' }
    ],
    objets_culte: [
      { name: 'Masque Zaouli', image: '/image/Gouro/objet cultes 1.jpg', desc: '' },
      { name: 'Masque Gouro', image: '/image/Gouro/objet cultes 2.jpg', desc: '' }
    ],
    image_url: '/image/Gouro/peuple gouro.jpg'
  },
  {
    id: '10',
    nom: 'Koulango',
    region: 'Nord-Est',
    description: 'Peuple du nord-est, à la frontière du Burkina Faso, cultivateur et gardien de traditions mandé.',
    histoire: 'Les Koulango sont installés dans le nord-est ivoirien, autour de Bouna et de la frontière burkinabè. Leur histoire est liée aux échanges avec les Mandé et les Lobi. Ils sont principalement cultivateurs (mil, sorgho, igname) et éleveurs. Leur organisation sociale et leurs rites funéraires reflètent une culture riche et peu médiatisée.',
    localite: 'Région du Bounkani (Bouna, Nassian, Doropo).',
    culture_rites: 'Les Koulango pratiquent des cérémonies liées à la terre et aux ancêtres. Les funérailles et les initiations mobilisent masques et danses. Leur artisanat (poterie, forge, tissage) est étroitement lié à la vie quotidienne et rituelle.',
    gastronomie: [
      { image: '/image/Koulango/gastronomie 1.jpg', name: 'Tô de mil', desc: '' },
      { image: '/image/Koulango/gastronomie 1.jpg', name: 'Sauce feuilles', desc: '' },
      { image: '/image/Koulango/gastronomie 1.jpg', name: 'Couscous de mil', desc: '' }
    ],
    objets_culte: [
      { name: 'Masque Koulango', image: '/image/Koulango/objet cultes 1.jpg', desc: '' },
      { name: 'Statuette', image: '/image/Koulango/objet clutes 2.jpg', desc: '' }
    ],
    image_url: '/image/Koulango/peuple koulango.jpg'
  }

];

export const EthnieList = ({ initialSearch = "" }: { initialSearch?: string }) => {
  const [ethnies, setEthnies] = useState<Ethnie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedEthnie, setSelectedEthnie] = useState<Ethnie | null>(null);

  useEffect(() => {
    const fetchEthnies = async () => {
      try {
        const { data, error } = await supabase.from('ethnies').select('*');
        if (error) throw error;
        const merged = [...MOCK_ETHNIES, ...(data || [])]
          .filter((v, i, a) => a.findIndex(t => t.nom === v.nom) === i)
          .filter(e => e.nom.toLowerCase() !== 'sanwi');
        setEthnies(merged);
      } catch (err) {
        setEthnies(MOCK_ETHNIES);
      } finally {
        setLoading(false);
      }
    };
    fetchEthnies();
  }, []);

  const filteredEthnies = ethnies.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-12 h-12 border-4 border-ivory-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (selectedEthnie) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#F5EFE6] -mt-6 sm:-mt-8 -mx-4 sm:-mx-6 pb-24 sm:pb-28"
      >
        {/* Floating Back Button */}
        <button
          onClick={() => setSelectedEthnie(null)}
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[60] flex items-center gap-2 sm:gap-3 bg-[#111111]/80 backdrop-blur-md text-[#F5EFE6] border border-[#F5EFE6]/10 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg hover:bg-[#1B4332] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-inter font-medium uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[9px] sm:text-[10px]">Retour</span>
        </button>

        {/* A. En-tête (Header Image) */}
        <div className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
          <img
            src={selectedEthnie.image_url}
            alt={selectedEthnie.nom}
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent" />
          <div className="absolute bottom-10 left-6 md:left-12">
            <h2 className="font-philosopher font-bold text-5xl md:text-7xl text-[#F5EFE6] tracking-tight">
              {selectedEthnie.nom}
            </h2>
            <p className="font-inter text-[#9C6644] text-[11px] uppercase tracking-[0.3em] mt-2 font-semibold">
              Région {selectedEthnie.region}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 -mt-6 md:-mt-8 relative z-10 space-y-8 sm:space-y-12">
          {/* B. Section HISTOIRE */}
          <section className="bg-[#F5EFE6] p-5 sm:p-6 md:p-8 lg:p-12 border border-[#9C6644]/20 rounded-sm shadow-xl shadow-[#111111]/5">
            <div className="mb-4 sm:mb-6">
              <h3 className="font-philosopher font-bold text-xl sm:text-2xl text-[#111111]">
                Histoire
              </h3>
              <div className="trame-divider w-12 mt-3" />
            </div>
            <p className="font-inter text-[#111111]/80 text-[14px] sm:text-[15px] leading-relaxed text-left">
              {selectedEthnie.histoire}
            </p>
          </section>

          {/* C. Section LOCALITÉ & RITES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F5EFE6] p-8 border border-[#9C6644]/20 rounded-sm shadow-md">
              <h3 className="font-philosopher font-bold text-xl text-[#111111] mb-4 flex items-center gap-3">
                <MapPin size={20} className="text-[#1B4332]" /> Localité
              </h3>
              <p className="font-inter text-[#111111]/80 text-[14px] leading-relaxed">
                {selectedEthnie.localite}
              </p>
            </div>
            <div className="bg-[#111111] p-8 rounded-sm shadow-md border border-[#F5EFE6]/10">
              <h3 className="font-philosopher font-bold text-xl text-[#F5EFE6] mb-4 flex items-center gap-3">
                <Ghost size={20} className="text-[#F77F00]" /> Rites
              </h3>
              <p className="font-inter text-[#F5EFE6]/70 text-[14px] leading-relaxed">
                {selectedEthnie.culture_rites}
              </p>
            </div>
          </div>

          {/* D. Section GASTRONOMIE (Carousel) */}
          {selectedEthnie.gastronomie && (
            <section className="space-y-6">
              <h3 className="font-philosopher font-bold text-2xl text-[#111111] text-center">
                Gastronomie
              </h3>
              <div className="trame-divider w-12 mx-auto" />
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
                {selectedEthnie.gastronomie.map((item, i) => (
                  <div key={i} className="min-w-[260px] md:min-w-[300px] snap-center space-y-3 group cursor-pointer">
                    <div className="h-56 rounded-sm overflow-hidden border border-[#9C6644]/20 shadow-sm relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="px-1">
                      <p className="font-philosopher font-bold text-[16px] text-[#111111]">
                        {item.name}
                      </p>
                      <p className="font-inter text-[12px] text-[#111111]/60 mt-1 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* E. Section OBJETS DE CULTE (Grid) */}
          {selectedEthnie.objets_culte && (
            <section className="space-y-8">
              <h3 className="font-philosopher font-bold text-2xl text-[#111111] text-center">
                Objets de Culte
              </h3>
              <div className="trame-divider w-12 mx-auto" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedEthnie.objets_culte.map((obj, i) => (
                  <div key={i} className="bg-[#F5EFE6] p-4 border border-[#9C6644]/20 rounded-sm hover:border-[#9C6644]/40 transition-colors text-center space-y-3 cursor-pointer group">
                    <div className="aspect-square rounded-sm overflow-hidden bg-[#111111]/5">
                      <img src={obj.image} alt={obj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="font-philosopher font-bold text-[14px] text-[#111111]">
                        {obj.name}
                      </p>
                      <p className="font-inter text-[11px] text-[#111111]/60 mt-1 line-clamp-2">
                        {obj.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-24">
      {/* 1. L'Entrée du Module */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-6"
      >
        <div className="trame-divider w-16 mx-auto mb-4" />
        <p className="font-playfair italic text-xl md:text-2xl text-[#111111] max-w-xl mx-auto leading-relaxed">
          "Immergez-vous dans le génie de nos ancêtres : découvrez les cultures ivoiriennes."
        </p>

        <div className="relative max-w-xl mx-auto group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#111111]/30 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Rechercher un peuple..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-[#F5EFE6] border border-[#9C6644]/20 focus:border-[#1B4332] outline-none transition-all text-[14px] font-inter text-[#111111] placeholder-[#111111]/40 rounded-sm shadow-sm"
          />
        </div>
      </motion.div>

      {/* Grid of Ethnicities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {filteredEthnies.map((ethnie) => (
            <motion.div
              key={ethnie.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedEthnie(ethnie)}
              className="bg-[#F5EFE6] rounded-sm overflow-hidden border border-[#9C6644]/20 hover:border-[#9C6644]/50 group cursor-pointer shadow-sm transition-all"
            >
              <div className="h-48 sm:h-56 overflow-hidden relative">
                <img
                  src={ethnie.image_url}
                  alt={ethnie.nom}
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <h3 className="font-philosopher font-bold text-2xl text-[#F5EFE6]">{ethnie.nom}</h3>
                  <p className="text-[#F77F00] font-inter font-semibold text-[10px] uppercase tracking-[0.2em] mt-1">{ethnie.region}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#111111]/70 font-inter text-[13px] line-clamp-2 mb-4 leading-relaxed">{ethnie.description}</p>
                <div className="text-[#1B4332] font-inter font-semibold text-[11px] flex items-center gap-2 uppercase tracking-[0.1em] group-hover:gap-3 transition-all">
                  Explorer <span>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredEthnies.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-stone-200">
          <p className="text-stone-400 text-xl font-bold">Aucun héritage trouvé pour "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};
