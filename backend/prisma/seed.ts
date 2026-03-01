import { PrismaClient, Role, NiveauType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Démarrage du seed MOYÉ...\n');

    // ================================================================
    // RÉGIONS DE CÔTE D'IVOIRE
    // ================================================================
    console.log(' Création des régions...');
    const regions = await Promise.all([
        prisma.region.upsert({
            where: { nom: 'Sud-Est (Abidjan)' },
            update: {},
            create: { nom: 'Sud-Est (Abidjan)', description: 'Région économique et culturelle d\'Abidjan', latitude: 5.3600, longitude: -4.0083 },
        }),
        prisma.region.upsert({
            where: { nom: 'Indénié-Djuablin' },
            update: {},
            create: { nom: 'Indénié-Djuablin', description: 'Région de l\'Est Côte d\'Ivoire, terre des Agni', latitude: 6.5000, longitude: -3.3000 },
        }),
        prisma.region.upsert({
            where: { nom: 'Lagunes' },
            update: {},
            create: { nom: 'Lagunes', description: 'La région des lagunes, berceau du peuple Avikam et Adjoukrou', latitude: 5.2000, longitude: -4.3000 },
        }),
        prisma.region.upsert({
            where: { nom: 'Vallée du Bandama' },
            update: {},
            create: { nom: 'Vallée du Bandama', description: 'Cœur du pays Baoulé', latitude: 7.0000, longitude: -5.5000 },
        }),
        prisma.region.upsert({
            where: { nom: 'Nord (Savanes)' },
            update: {},
            create: { nom: 'Nord (Savanes)', description: 'Terres des Sénoufo et Malinké', latitude: 9.5000, longitude: -6.5000 },
        }),
        prisma.region.upsert({
            where: { nom: 'Moyen-Cavally' },
            update: {},
            create: { nom: 'Moyen-Cavally', description: 'Région de l\'Ouest, forêts sacrées Bété et Guéré', latitude: 6.0000, longitude: -7.0000 },
        }),
    ]);

    const sudEst = regions[0];
    const indenieRegion = regions[1];
    const lagunes = regions[2];
    const bandama = regions[3];
    const nord = regions[4];

    console.log(` ${regions.length} régions créées\n`);

    // ================================================================
    // ETHNIE 1 : SANWI (Agni du Sud-Est)
    // ================================================================
    console.log('  Création de l\'ethnie Sanwi...');
    const sanwi = await prisma.ethnie.upsert({
        where: { slug: 'sanwi' },
        update: {},
        create: {
            nom: 'Sanwi',
            slug: 'sanwi',
            groupeLinguistique: 'Kwa (Agni-Baoulé)',
            populationEstimee: 500000,
            langues: ['agni', 'fr'],
            description:
                'Le peuple Sanwi est un sous-groupe du peuple Agni établi dans le sud-est de la Côte d\'Ivoire. Ils forment un royaume historiquement organisé autour du Roi (Bia Kpanyinli). Culturellement riches, les Sanwi sont connus pour leurs sculptures sur bois, leurs tissages et leurs cérémonies funèbres majestueuses.',
            origines:
                'Originaires du Ghana actuel (région Ashanti), les Agni ont migré vers la Côte d\'Ivoire au XVIIIe siècle. Le Sanwi s\'est constitué comme royaume propre avec sa cour royale à Krinjabo.',
            imageUrl: '/images/ethnies/sanwi-cover.jpg',
            regionId: sudEst.id,
        },
    });

    // Histoires Sanwi
    await prisma.histoire.upsert({
        where: { id: 'hist-sanwi-1' },
        update: {},
        create: {
            id: 'hist-sanwi-1',
            titre: 'L\'Exode Ashanti et la Fondation du Royaume',
            contenu:
                'Fuyant les guerres tribales du Ghana vers le XVIIIe siècle, les ancêtres du peuple Sanwi traversèrent le fleuve Comoé pour s\'établir dans les forêts du sud-est. Sous la conduite de leurs rois, ils édifièrent le Royaume du Sanwi avec sa capitale royale à Krinjabo. Ce royaume, structuré en hiérarchie matrilinéaire, entretint rapidement des relations diplomatiques avec les puissances coloniales européennes.',
            periode: 'XVIIIe - XIXe siècle',
            ethnieId: sanwi.id,
        },
    });

    await prisma.histoire.upsert({
        where: { id: 'hist-sanwi-2' },
        update: {},
        create: {
            id: 'hist-sanwi-2',
            titre: 'Le Traité de 1843 avec la France',
            contenu:
                'En 1843, le Roi du Sanwi signa un traité de protectorat avec la France, faisant du Sanwi l\'un des premiers royaumes ivoiriens à entrer officiellement en contact diplomatique avec l\'Europe. Cet accord, tout en préservant une autonomie partielle, ouvrit la voie à une coexistence ambivalente entre tradition et modernité coloniale.',
            periode: 'XIXe siècle',
            ethnieId: sanwi.id,
        },
    });

    // Rites Sanwi
    await prisma.rite.upsert({
        where: { id: 'rite-sanwi-1' },
        update: {},
        create: {
            id: 'rite-sanwi-1',
            nom: 'Fêtes des Ignames (Odwira)',
            description:
                'L\'Odwira est la grande fête annuelle des Agni-Sanwi, célébrée en septembre-octobre. C\'est un moment de purification collective, de remerciement aux ancêtres et de renouveau du lien social.',
            signification:
                'Purification des fautes collectives, offrandes aux ancêtres, réaffirmation de l\'autorité royale. La fête dure plusieurs jours et comprend des processions royales, des danses sacrées et des libations.',
            periode: 'Septembre-Octobre (chaque année)',
            ethnieId: sanwi.id,
        },
    });

    await prisma.rite.upsert({
        where: { id: 'rite-sanwi-2' },
        update: {},
        create: {
            id: 'rite-sanwi-2',
            nom: 'Funérailles Royales (Awuloo)',
            description:
                'Les funérailles des personnages importants chez les Sanwi sont des événements majeurs qui peuvent durer plusieurs semaines. Les Awuloo (grandes funérailles) impliquent danses, sculptures d\'hommage, offrandes de pagnes et de cola.',
            signification:
                'Accompagnement du défunt dans le monde des ancêtres, renforcement du lien entre vivants et morts.',
            ethnieId: sanwi.id,
        },
    });

    // Objets culturels Sanwi
    await prisma.objetCulturel.upsert({
        where: { id: 'obj-sanwi-1' },
        update: {},
        create: {
            id: 'obj-sanwi-1',
            nom: 'Tabouret Royal (Akua Ba)',
            description:
                'Le tabouret royal est le symbole suprême du pouvoir chez les Agni-Sanwi. Finement sculpté dans l\'ébène ou le bois de fromager, il ne touche jamais le sol directement.',
            signification:
                'Symbole de l\'âme collective du peuple. Le tabouret représente le lien mystique entre le roi et ses ancêtres.',
            matiere: 'Bois (ébène, fromager)',
            epoque: 'XVIIIe siècle à nos jours',
            tags: ['tabouret', 'bois', 'royauté', 'sculpture', 'ébène', 'pouvoir'],
            ethnieId: sanwi.id,
        },
    });

    await prisma.objetCulturel.upsert({
        where: { id: 'obj-sanwi-2' },
        update: {},
        create: {
            id: 'obj-sanwi-2',
            nom: 'Masque Portrait (Mblo)',
            description:
                'Masque en bois à visage humain utilisé lors des danses de divertissement. Contrairement aux masques de puissance, le Mblo représente souvent des personnages admirés de la communauté.',
            signification:
                'Hommage à une personne admirée, célébration de la beauté et des vertus humaines.',
            matiere: 'Bois peint, fibres végétales',
            tags: ['masque', 'bois', 'danse', 'portrait', 'visage'],
            ethnieId: sanwi.id,
        },
    });

    // Gastronomie Sanwi
    await prisma.gastronomie.upsert({
        where: { id: 'gastro-sanwi-1' },
        update: {},
        create: {
            id: 'gastro-sanwi-1',
            nom: 'Foutou Banane et Sauce Graine',
            description:
                'Plat emblématique de la cuisine Agni, le foutou banane est préparé à partir de bananes plantains pilées avec de l\'igname. Il est accompagné d\'une sauce à base de graines de palme.',
            ingredients: ['Banane plantain', 'Igname', 'Graines de palme', 'Poisson fumé', 'Piment', 'Feuilles de bananier', 'Sel'],
            preparation:
                'Cuire les bananes et l\'igname, puis piler au mortier jusqu\'à obtenir une pâte homogène. La sauce graine est préparée en faisant bouillir les graines de palme puis en les malaxant pour extraire l\'huile rouge.',
            occasion: 'Repas quotidien et cérémonies',
            ethnieId: sanwi.id,
        },
    });

    // Fêtes Sanwi
    await prisma.fete.upsert({
        where: { id: 'fete-sanwi-1' },
        update: {},
        create: {
            id: 'fete-sanwi-1',
            nom: 'Festival Sanwi',
            description:
                'Festival annuel célébrant la culture et le patrimoine du peuple Sanwi. Des danses traditionnelles, expositions d\'artisanat, et compétitions culinaires se déroulent à Aboisso.',
            periode: 'Décembre',
            lieu: 'Aboisso, Côte d\'Ivoire',
            ethnieId: sanwi.id,
        },
    });

    console.log(' Ethnie Sanwi créée avec toutes ses données\n');

    // ================================================================
    // ETHNIE 2 : INDÉNIÉ-DJUABLIN (Agni de l'Est)
    // ================================================================
    console.log('  Création de l\'ethnie Indénié...');
    const indenie = await prisma.ethnie.upsert({
        where: { slug: 'indenie-djuablin' },
        update: {},
        create: {
            nom: 'Indénié-Djuablin',
            slug: 'indenie-djuablin',
            groupeLinguistique: 'Kwa (Agni)',
            populationEstimee: 350000,
            langues: ['agni', 'fr'],
            description:
                'L\'Indénié-Djuablin est un peuple Agni de l\'Est de la Côte d\'Ivoire, établi autour d\'Abengourou. Organisé en deux royaumes (Indénié et Djuablin), ce peuple est réputé pour son art du pagne tissé et ses traditions de cour royale.',
            origines:
                'Comme les Sanwi, les Agni d\'Indénié sont originaires de la région Ashanti du Ghana et se sont établis à l\'Est de la Côte d\'Ivoire au XVIIIe siècle.',
            imageUrl: '/images/ethnies/indenie-cover.jpg',
            regionId: indenieRegion.id,
        },
    });

    await prisma.histoire.upsert({
        where: { id: 'hist-indenie-1' },
        update: {},
        create: {
            id: 'hist-indenie-1',
            titre: 'Le Royaume d\'Indénié et la Cour Royale d\'Abengourou',
            contenu:
                'Le Royaume d\'Indénié a été fondé au XVIIIe siècle par des migrants Agni venus du Ghana. La capitale Abengourou est devenue le centre politique et culturel du royaume. La cour royale d\'Indénié est célèbre pour sa sophistication, ses protocoles stricts et ses cérémonies d\'intronisation qui perpétuent des traditions centenaires.',
            periode: 'XVIIIe siècle à nos jours',
            ethnieId: indenie.id,
        },
    });

    await prisma.rite.upsert({
        where: { id: 'rite-indenie-1' },
        update: {},
        create: {
            id: 'rite-indenie-1',
            nom: 'Intronisation Royale (Akwasidae)',
            description:
                'La cérémonie d\'intronisation du nouveau roi est l\'un des événements les plus solennels de la société Agni-Indénié. Elle implique des rituels de purification, la remise du tabouret royal et des serments devant les ancêtres.',
            signification:
                'Transmission du pouvoir royal et de l\'âme collective du peuple au nouveau souverain.',
            ethnieId: indenie.id,
        },
    });

    await prisma.objetCulturel.upsert({
        where: { id: 'obj-indenie-1' },
        update: {},
        create: {
            id: 'obj-indenie-1',
            nom: 'Pagne Tissé (Kente Agni)',
            description:
                'Le pagne kente Agni est tissé à la main sur des métiers traditionnels. Chaque motif porte une signification symbolique précise, représentant des proverbes, des événements historiques ou des statuts sociaux.',
            signification:
                'Le port du kente lors des cérémonies symbolise le rang social, l\'appartenance clanique et les valeurs transmises par les ancêtres.',
            matiere: 'Soie, coton tissé à la main',
            tags: ['pagne', 'kente', 'tissu', 'tissage', 'soie', 'motif'],
            ethnieId: indenie.id,
        },
    });

    await prisma.gastronomie.upsert({
        where: { id: 'gastro-indenie-1' },
        update: {},
        create: {
            id: 'gastro-indenie-1',
            nom: 'Aloco (Banane Plantain Frite)',
            description:
                'L\'Aloco est une préparation simple mais savoureuse de bananes plantains mûres frites dans de l\'huile, souvent accompagnées de poisson braisé et de piment frais.',
            ingredients: ['Banane plantain mûre', 'Huile de palme', 'Sel', 'Piment frais', 'Poisson braisé (tilapia ou capitaine)'],
            preparation:
                'Éplucher et couper les bananes en rondelles obliques. Faire chauffer l\'huile et frire jusqu\'à dorure. Servir chaud avec poisson et piment.',
            occasion: 'Repas quotidien, encas populaire',
            ethnieId: indenie.id,
        },
    });

    await prisma.fete.upsert({
        where: { id: 'fete-indenie-1' },
        update: {},
        create: {
            id: 'fete-indenie-1',
            nom: 'Festival des Arts et Traditions Agni',
            description:
                'Festival bi-annuel qui célèbre l\'art, la danse et la spiritualité du peuple Agni. Des troupes venues de tout le pays se réunissent à Abengourou pour des compétitions artistiques.',
            periode: 'Juillet (années paires)',
            lieu: 'Abengourou, Côte d\'Ivoire',
            ethnieId: indenie.id,
        },
    });

    console.log(' Ethnie Indénié-Djuablin créée\n');

    // ================================================================
    // ETHNIE 3 : BAOULÉ
    // ================================================================
    console.log('  Création de l\'ethnie Baoulé...');
    const baoule = await prisma.ethnie.upsert({
        where: { slug: 'baoule' },
        update: {},
        create: {
            nom: 'Baoulé',
            slug: 'baoule',
            groupeLinguistique: 'Kwa (Agni-Baoulé)',
            populationEstimee: 3000000,
            langues: ['baoule', 'fr'],
            description:
                'Le peuple Baoulé est l\'un des groupes ethniques les plus nombreux de Côte d\'Ivoire, établi au centre du pays. Leur art, notamment leurs masques et statuettes, est reconnu internationalement. La reine Abraha Pokou est leur figure fondatrice légendaire.',
            origines:
                'Selon la tradition orale, les Baoulé sont issus d\'une migration depuis l\'Empire Ashanti au XVIIIe siècle, sous la conduite de la reine Abraha Pokou qui, pour traverser le fleuve Comoé, sacrifia son fils unique.',
            regionId: bandama.id,
        },
    });

    await prisma.objetCulturel.upsert({
        where: { id: 'obj-baoule-1' },
        update: {},
        create: {
            id: 'obj-baoule-1',
            nom: 'Masque Kpan',
            description:
                'Le masque Kpan est un masque féminin idéalisé utilisé lors des danses de divertissement (danse Goli). Représentant le visage serein d\'une femme, il est peint en blanc et noir avec des scarifications rituelles.',
            signification:
                'Célébration de la féminité et des idéaux de beauté Baoulé. Le masque Kpan représente l\'épouse idéale.',
            matiere: 'Bois de fromager peint',
            tags: ['masque', 'bois', 'féminin', 'goli', 'danse', 'blanc'],
            ethnieId: baoule.id,
        },
    });

    console.log(' Ethnie Baoulé créée\n');

    // ================================================================
    // LANGUES
    // ================================================================
    console.log('  Création des langues...');
    const langues = await Promise.all([
        prisma.langue.upsert({
            where: { code: 'fr' },
            update: {},
            create: { code: 'fr', nom: 'Français', nomLocal: 'Français', famille: 'Indo-européen' },
        }),
        prisma.langue.upsert({
            where: { code: 'baoule' },
            update: {},
            create: { code: 'baoule', nom: 'Baoulé', nomLocal: 'Baoulé', famille: 'Kwa' },
        }),
        prisma.langue.upsert({
            where: { code: 'dioula' },
            update: {},
            create: { code: 'dioula', nom: 'Dioula', nomLocal: 'Julakan', famille: 'Mandé' },
        }),
        prisma.langue.upsert({
            where: { code: 'bete' },
            update: {},
            create: { code: 'bete', nom: 'Bété', nomLocal: 'Bété', famille: 'Kru' },
        }),
        prisma.langue.upsert({
            where: { code: 'senoufo' },
            update: {},
            create: { code: 'senoufo', nom: 'Sénoufo', nomLocal: 'Sénoufo', famille: 'Gur' },
        }),
        prisma.langue.upsert({
            where: { code: 'agni' },
            update: {},
            create: { code: 'agni', nom: 'Agni', nomLocal: 'Aniyi', famille: 'Kwa' },
        }),
        prisma.langue.upsert({
            where: { code: 'guere' },
            update: {},
            create: { code: 'guere', nom: 'Guéré', nomLocal: 'Wê', famille: 'Kru' },
        }),
    ]);

    const fr = langues[0];
    const baouleLang = langues[1];
    const dioulaLang = langues[2];

    console.log(` ${langues.length} langues créées\n`);

    // Mots exemples
    const motsData = [
        { mot: 'Bonjour', phonetique: 'bon-jour', categorie: 'salutation', langueId: fr.id },
        { mot: 'Merci', phonetique: 'mer-si', categorie: 'politesse', langueId: fr.id },
        { mot: 'Akwaba', phonetique: 'a-kwa-ba', categorie: 'salutation', langueId: baouleLang.id },
        { mot: 'Mo akua', phonetique: 'mo-a-kua', categorie: 'politesse', langueId: baouleLang.id },
        { mot: 'É kéh?', phonetique: 'é-keh', categorie: 'question', langueId: baouleLang.id },
        { mot: 'I ni ce', phonetique: 'i-ni-ché', categorie: 'salutation', langueId: dioulaLang.id },
        { mot: 'I ni baara', phonetique: 'i-ni-ba-ra', categorie: 'politesse', langueId: dioulaLang.id },
        { mot: 'I ka kénê?', phonetique: 'i-ka-ke-né', categorie: 'question', langueId: dioulaLang.id },
    ];

    for (const motData of motsData) {
        await prisma.mot.upsert({
            where: { mot_langueId: { mot: motData.mot, langueId: motData.langueId } },
            update: {},
            create: motData,
        });
    }

    console.log(` ${motsData.length} mots créés\n`);

    // Traductions exemples
    const traductionsData = [
        { texteSource: 'Bonjour', texteTraduction: 'Akwaba', langueSourceId: fr.id, langueCibleId: baouleLang.id, validee: true },
        { texteSource: 'Merci', texteTraduction: 'Mo akua', langueSourceId: fr.id, langueCibleId: baouleLang.id, validee: true },
        { texteSource: 'Comment ça va', texteTraduction: 'É kéh?', langueSourceId: fr.id, langueCibleId: baouleLang.id, validee: true },
        { texteSource: 'Bonjour', texteTraduction: 'I ni ce', langueSourceId: fr.id, langueCibleId: dioulaLang.id, validee: true },
        { texteSource: 'Merci', texteTraduction: 'I ni baara', langueSourceId: fr.id, langueCibleId: dioulaLang.id, validee: true },
        { texteSource: 'Bienvenue', texteTraduction: 'Akwaba', langueSourceId: fr.id, langueCibleId: baouleLang.id, validee: true },
    ];

    for (const trad of traductionsData) {
        await prisma.traduction.upsert({
            where: {
                id: `trad-${trad.texteSource.slice(0, 5)}-${trad.langueCibleId.slice(-5)}`,
            },
            update: {},
            create: { id: `trad-${trad.texteSource.slice(0, 5)}-${trad.langueCibleId.slice(-5)}`, ...trad },
        });
    }

    console.log(` ${traductionsData.length} traductions créées\n`);

    // ================================================================
    // CANAUX DE DISCUSSION
    // ================================================================
    console.log(' Création des canaux de discussion...');
    const canaux = [
        { nom: 'Général - Échanges Culturels', slug: 'general', description: 'Canal principal d\'échanges culturels' },
        { nom: 'Baoulé - Langue & Culture', slug: 'baoule', description: 'Échanges en langue Baoulé' },
        { nom: 'Dioula - Commerce & Tradition', slug: 'dioula', description: 'Le Dioula, langue du commerce ivoirien' },
        { nom: 'Traditions & Rites', slug: 'traditions', description: 'Partage de traditions et pratiques rituelles' },
        { nom: 'Gastronomie Ivoirienne', slug: 'gastronomie', description: 'Recettes et cuisine traditionnelle' },
    ];

    for (const canal of canaux) {
        await prisma.canalDiscussion.upsert({
            where: { slug: canal.slug },
            update: {},
            create: canal,
        });
    }

    console.log(` ${canaux.length} canaux créés\n`);

    // ================================================================
    // ACADÉMIE - NIVEAUX
    // ================================================================
    console.log('🎓 Création des niveaux académie...');
    const niveaux = [
        { type: NiveauType.GRAIN_DE_SABLE, nom: 'Grain de Sable', description: 'Niveau débutant - Découverte des bases culturelles', pointsRequis: 0, ordre: 1 },
        { type: NiveauType.PALMIER, nom: 'Palmier', description: 'Niveau intermédiaire - Approfondissement des traditions', pointsRequis: 100, ordre: 2 },
        { type: NiveauType.BAOBAB, nom: 'Baobab', description: 'Niveau expert - Maître du patrimoine ivoirien', pointsRequis: 500, ordre: 3 },
    ];

    for (const niv of niveaux) {
        const niveau = await prisma.niveau.upsert({
            where: { type: niv.type },
            update: {},
            create: niv,
        });

        // Créer une leçon exemple pour chaque niveau
        if (niv.type === NiveauType.GRAIN_DE_SABLE) {
            const lecon = await prisma.lecon.upsert({
                where: { id: `lecon-${niv.type}-1` },
                update: {},
                create: {
                    id: `lecon-${niv.type}-1`,
                    titre: 'Introduction aux 60 Ethnies de Côte d\'Ivoire',
                    description: 'Découvrez la diversité culturelle extraordinaire de la Côte d\'Ivoire',
                    contenu: 'La Côte d\'Ivoire est habitée par plus de 60 groupes ethniques répartis en 4 grandes familles linguistiques: les Kwa (Baoulé, Agni, Adjoukrou), les Mandé (Dioula, Malinké), les Gur (Sénoufo, Lobi) et les Krou (Bété, Guéré, Wé). Cette diversité est la force de la nation ivoirienne.',
                    pointsGain: 20,
                    dureeMin: 10,
                    niveauId: niveau.id,
                    ordre: 1,
                },
            });

            // Questions pour la leçon
            const question = await prisma.question.upsert({
                where: { id: 'q-intro-1' },
                update: {},
                create: {
                    id: 'q-intro-1',
                    enonce: 'Combien de groupes ethniques compte approximativement la Côte d\'Ivoire ?',
                    type: 'choix_multiple',
                    explication: 'La Côte d\'Ivoire compte plus de 60 groupes ethniques différents, reflétant une remarquable diversité culturelle.',
                    leconId: lecon.id,
                },
            });

            const reponsesQ1 = [
                { contenu: 'Environ 20 groupes', estCorrecte: false, questionId: question.id },
                { contenu: 'Plus de 60 groupes', estCorrecte: true, questionId: question.id },
                { contenu: 'Exactement 10 groupes', estCorrecte: false, questionId: question.id },
                { contenu: 'Moins de 5 groupes', estCorrecte: false, questionId: question.id },
            ];

            for (let i = 0; i < reponsesQ1.length; i++) {
                await prisma.reponse.upsert({
                    where: { id: `rep-intro-1-${i}` },
                    update: {},
                    create: { id: `rep-intro-1-${i}`, ...reponsesQ1[i] },
                });
            }

            const question2 = await prisma.question.upsert({
                where: { id: 'q-intro-2' },
                update: {},
                create: {
                    id: 'q-intro-2',
                    enonce: 'Quel est le terme "Bienvenue" en Baoulé ?',
                    type: 'choix_multiple',
                    explication: '"Akwaba" signifie "Bienvenue" en Baoulé. C\'est l\'un des mots les plus importants de la culture ivoirienne.',
                    leconId: lecon.id,
                },
            });

            const reponsesQ2 = [
                { contenu: 'Akwaba', estCorrecte: true, questionId: question2.id },
                { contenu: 'Merci', estCorrecte: false, questionId: question2.id },
                { contenu: 'Bonjour', estCorrecte: false, questionId: question2.id },
                { contenu: 'Salaam', estCorrecte: false, questionId: question2.id },
            ];

            for (let i = 0; i < reponsesQ2.length; i++) {
                await prisma.reponse.upsert({
                    where: { id: `rep-intro-2-${i}` },
                    update: {},
                    create: { id: `rep-intro-2-${i}`, ...reponsesQ2[i] },
                });
            }
        }
    }

    console.log(' Niveaux et leçons créés\n');

    // ================================================================
    // BADGES
    // ================================================================
    console.log(' Création des badges...');
    const badges = [
        { nom: 'Explorateur Culturel', description: 'Premier pas dans la découverte du patrimoine ivoirien', condition: 'Créer un compte MOYÉ', pointsBonus: 10 },
        { nom: 'Apprenti Culturel', description: 'Atteindre 100 points Moyé-Or', condition: '100 points Moyé-Or', pointsBonus: 25 },
        { nom: 'Gardien du Patrimoine', description: 'Compléter 10 leçons de l\'académie', condition: '10 leçons complétées', pointsBonus: 50 },
        { nom: 'Maître des Langues', description: 'Réaliser 50 traductions', condition: '50 traductions effectuées', pointsBonus: 75 },
        { nom: 'Sage du Baobab', description: 'Atteindre le niveau Baobab (500+ points)', condition: '500+ points Moyé-Or', pointsBonus: 100 },
        { nom: 'Ambassadeur Sanwi', description: 'Lire toutes les fiches du peuple Sanwi', condition: 'Explorer toute la section Sanwi', pointsBonus: 30 },
    ];

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { nom: badge.nom },
            update: {},
            create: badge,
        });
    }

    console.log(`✅ ${badges.length} badges créés\n`);

    // ================================================================
    // UTILISATEURS (Admin + Test)
    // ================================================================
    console.log('👤 Création des utilisateurs de test...');

    const adminHash = await bcrypt.hash('Admin2024!', 12);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@moye.ci' },
        update: {},
        create: {
            email: 'admin@moye.ci',
            pseudo: 'MoyeAdmin',
            passwordHash: adminHash,
            firstName: 'Admin',
            lastName: 'MOYÉ',
            role: Role.ADMIN,
            moyeOrPoints: 9999,
            isVerified: true,
        },
    });

    const expertHash = await bcrypt.hash('Expert2024!', 12);
    await prisma.user.upsert({
        where: { email: 'expert@moye.ci' },
        update: {},
        create: {
            email: 'expert@moye.ci',
            pseudo: 'ExpertCulture',
            passwordHash: expertHash,
            firstName: 'Kofi',
            lastName: 'Mensah',
            role: Role.EXPERT_CULTUREL,
            moyeOrPoints: 500,
            isVerified: true,
        },
    });

    const userHash = await bcrypt.hash('User2024!', 12);
    await prisma.user.upsert({
        where: { email: 'user@moye.ci' },
        update: {},
        create: {
            email: 'user@moye.ci',
            pseudo: 'AmaKofi',
            passwordHash: userHash,
            firstName: 'Ama',
            lastName: 'Kofi',
            role: Role.USER,
            moyeOrPoints: 120,
            streakDays: 5,
            isVerified: true,
        },
    });

    // Attribuer badge explorateur à l'admin
    const explorateurBadge = await prisma.badge.findUnique({ where: { nom: 'Explorateur Culturel' } });
    if (explorateurBadge) {
        await prisma.userBadge.upsert({
            where: { userId_badgeId: { userId: adminUser.id, badgeId: explorateurBadge.id } },
            update: {},
            create: { userId: adminUser.id, badgeId: explorateurBadge.id },
        });
    }

    console.log('✅ Utilisateurs de test créés\n');

    // ================================================================
    // PODCASTS EXEMPLES
    // ================================================================
    console.log('🎙️  Création de podcasts exemples...');
    await prisma.podcast.upsert({
        where: { id: 'podcast-1' },
        update: {},
        create: {
            id: 'podcast-1',
            titre: 'L\'Histoire fascinante du Royaume Sanwi',
            description:
                'Dans cet épisode, nous explorons les origines du Royaume Sanwi, ses relations avec l\'empire Ashanti du Ghana et sa résistance culturelle face à la colonisation.',
            audioUrl: '/uploads/audio/sample-podcast.mp3',
            langue: 'fr',
            tags: ['sanwi', 'histoire', 'royaume', 'agni'],
            isPublished: true,
            auteurId: adminUser.id,
        },
    });

    await prisma.podcast.upsert({
        where: { id: 'podcast-2' },
        update: {},
        create: {
            id: 'podcast-2',
            titre: 'Apprendre le Baoulé - Leçon 1 : Les Salutations',
            description:
                'Première leçon pour apprendre les salutations en langue Baoulé. Akwaba, é kéh, mo akua... Découvrez les bases de cette belle langue.',
            audioUrl: '/uploads/audio/sample-baoule-lesson1.mp3',
            langue: 'baoule',
            tags: ['baoulé', 'langue', 'apprentissage', 'salutations'],
            isPublished: true,
            auteurId: adminUser.id,
        },
    });

    console.log('✅ Podcasts exemples créés\n');

    // ================================================================
    // ONG EXEMPLE
    // ================================================================
    await prisma.oNG.upsert({
        where: { id: 'ong-1' },
        update: {},
        create: {
            id: 'ong-1',
            nom: 'Fondation Patrimoine CI',
            description: 'Organisation dédiée à la préservation du patrimoine culturel immatériel de Côte d\'Ivoire',
            mission: 'Documenter, préserver et transmettre les traditions orales, danses, musiques et savoirs ancestraux des 60+ ethnies ivoiriennes.',
            domaine: 'patrimoine',
            localisation: 'Abidjan, Côte d\'Ivoire',
            email: 'contact@patrimoineci.org',
            siteWeb: 'https://patrimoineci.org',
            isVerified: true,
            responsableId: adminUser.id,
        },
    });

    console.log('✅ ONG exemple créée\n');

    console.log(`
╔══════════════════════════════════════════════╗
║     🌍 SEED MOYÉ COMPLÉTÉ AVEC SUCCÈS        ║
╠══════════════════════════════════════════════╣
║  ✅ 6 Régions                                ║
║  ✅ 3 Ethnies (Sanwi, Indénié, Baoulé)       ║
║  ✅ 7 Langues (fr, baoulé, dioula...)        ║
║  ✅ 8 Mots traduits + 6 Traductions          ║
║  ✅ 5 Canaux de discussion                   ║
║  ✅ 3 Niveaux + Leçons + Quiz                ║
║  ✅ 6 Badges Moyé-Or                         ║
║  ✅ 3 Utilisateurs (admin/expert/user)       ║
║  ✅ 2 Podcasts + 1 ONG                       ║
╠══════════════════════════════════════════════╣
║  📧 Admin   : admin@moye.ci / Admin2024!     ║
║  📧 Expert  : expert@moye.ci / Expert2024!   ║
║  📧 User    : user@moye.ci / User2024!       ║
╚══════════════════════════════════════════════╝
  `);
}

main()
    .catch((e) => {
        console.error('❌ Erreur seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
