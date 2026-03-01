import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../middlewares/errorHandler';

export interface EthnieFilters {
    search?: string;
    regionId?: string;
    groupeLinguistique?: string;
    page?: number;
    limit?: number;
}

export class EthnieService {
    // Liste des ethnies avec filtres et pagination
    async findAll(filters: EthnieFilters = {}) {
        const { search, regionId, groupeLinguistique, page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { groupeLinguistique: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (regionId) where.regionId = regionId;
        if (groupeLinguistique) where.groupeLinguistique = { contains: groupeLinguistique, mode: 'insensitive' };

        const [total, ethnies] = await Promise.all([
            prisma.ethnie.count({ where }),
            prisma.ethnie.findMany({
                where,
                skip,
                take: limit,
                include: {
                    region: { select: { id: true, nom: true } },
                    _count: {
                        select: {
                            histoires: true,
                            rites: true,
                            objetsCulturels: true,
                            gastronomies: true,
                            fetes: true,
                        },
                    },
                },
                orderBy: { nom: 'asc' },
            }),
        ]);

        return {
            data: ethnies,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Détail d'une ethnie
    async findBySlug(slug: string) {
        const ethnie = await prisma.ethnie.findUnique({
            where: { slug },
            include: {
                region: true,
                histoires: { orderBy: { createdAt: 'asc' } },
                rites: { orderBy: { nom: 'asc' } },
                objetsCulturels: { orderBy: { nom: 'asc' } },
                gastronomies: { orderBy: { nom: 'asc' } },
                fetes: { orderBy: { nom: 'asc' } },
            },
        });

        if (!ethnie) throw new NotFoundError('Ethnie');
        return ethnie;
    }

    // Chercher par ID
    async findById(id: string) {
        const ethnie = await prisma.ethnie.findUnique({
            where: { id },
            include: { region: true },
        });
        if (!ethnie) throw new NotFoundError('Ethnie');
        return ethnie;
    }

    // Créer une ethnie
    async create(data: any) {
        return prisma.ethnie.create({
            data,
            include: { region: true },
        });
    }

    // Mettre à jour
    async update(id: string, data: any) {
        await this.findById(id);
        return prisma.ethnie.update({
            where: { id },
            data,
            include: { region: true },
        });
    }

    // Supprimer
    async delete(id: string) {
        await this.findById(id);
        return prisma.ethnie.delete({ where: { id } });
    }

    // Objets culturels d'une ethnie (pour recherche IA)
    async getObjetsCulturels(ethnieId?: string, tags?: string[]) {
        const where: any = {};
        if (ethnieId) where.ethnieId = ethnieId;
        if (tags && tags.length > 0) {
            where.tags = { hasSome: tags };
        }

        return prisma.objetCulturel.findMany({
            where,
            include: { ethnie: { select: { nom: true, slug: true } } },
        });
    }

    // Toutes les régions
    async getRegions() {
        return prisma.region.findMany({ orderBy: { nom: 'asc' } });
    }

    // CRUD sous-ressources: Histoire
    async createHistoire(ethnieId: string, data: any) {
        await this.findById(ethnieId);
        return prisma.histoire.create({ data: { ...data, ethnieId } });
    }

    // CRUD sous-ressources: Rite
    async createRite(ethnieId: string, data: any) {
        await this.findById(ethnieId);
        return prisma.rite.create({ data: { ...data, ethnieId } });
    }

    // CRUD sous-ressources: Gastronomie
    async createGastronomie(ethnieId: string, data: any) {
        await this.findById(ethnieId);
        return prisma.gastronomie.create({ data: { ...data, ethnieId } });
    }

    // CRUD sous-ressources: Fête
    async createFete(ethnieId: string, data: any) {
        await this.findById(ethnieId);
        return prisma.fete.create({ data: { ...data, ethnieId } });
    }
}

export const ethnieService = new EthnieService();
