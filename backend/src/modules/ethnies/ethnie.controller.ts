import { Request, Response } from 'express';
import { ethnieService } from './ethnie.service';
import { qs, qn } from '../../utils/helpers';

export class EthnieController {
    // GET /ethnies
    async findAll(req: Request, res: Response): Promise<void> {
        const search = qs(req.query.search);
        const regionId = qs(req.query.regionId);
        const groupeLinguistique = qs(req.query.groupeLinguistique);
        const page = qn(req.query.page);
        const limit = qn(req.query.limit);

        const result = await ethnieService.findAll({
            search,
            regionId,
            groupeLinguistique,
            page,
            limit,
        });

        res.json({ success: true, ...result });
    }

    // GET /ethnies/regions
    async getRegions(_req: Request, res: Response): Promise<void> {
        const regions = await ethnieService.getRegions();
        res.json({ success: true, data: regions });
    }

    // GET /ethnies/:slug
    async findBySlug(req: Request, res: Response): Promise<void> {
        const ethnie = await ethnieService.findBySlug(qs(req.params.slug));
        res.json({ success: true, data: ethnie });
    }

    // POST /ethnies
    async create(req: Request, res: Response): Promise<void> {
        const ethnie = await ethnieService.create(req.body);
        res.status(201).json({ success: true, message: 'Ethnie créée', data: ethnie });
    }

    // PUT /ethnies/:id
    async update(req: Request, res: Response): Promise<void> {
        const ethnie = await ethnieService.update(qs(req.params.id), req.body);
        res.json({ success: true, message: 'Ethnie mise à jour', data: ethnie });
    }

    // DELETE /ethnies/:id
    async delete(req: Request, res: Response): Promise<void> {
        await ethnieService.delete(qs(req.params.id));
        res.json({ success: true, message: 'Ethnie supprimée' });
    }

    // POST /ethnies/:id/histoires
    async createHistoire(req: Request, res: Response): Promise<void> {
        const histoire = await ethnieService.createHistoire(qs(req.params.id), req.body);
        res.status(201).json({ success: true, data: histoire });
    }

    // POST /ethnies/:id/rites
    async createRite(req: Request, res: Response): Promise<void> {
        const rite = await ethnieService.createRite(qs(req.params.id), req.body);
        res.status(201).json({ success: true, data: rite });
    }

    // POST /ethnies/:id/gastronomies
    async createGastronomie(req: Request, res: Response): Promise<void> {
        const gastronomie = await ethnieService.createGastronomie(qs(req.params.id), req.body);
        res.status(201).json({ success: true, data: gastronomie });
    }

    // POST /ethnies/:id/fetes
    async createFete(req: Request, res: Response): Promise<void> {
        const fete = await ethnieService.createFete(qs(req.params.id), req.body);
        res.status(201).json({ success: true, data: fete });
    }
}

export const ethnieController = new EthnieController();
