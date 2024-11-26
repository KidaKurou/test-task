import { Request, Response } from 'express';
import { InventoryService } from '../services/inventoryService';
import { CreateInventoryDto, UpdateInventoryQuantityDto } from '../interfaces';

export class InventoryController {
    private inventoryService = new InventoryService();

    async createInventory(req: Request, res: Response) {
        try {
            const inventoryData: CreateInventoryDto = req.body;
            const inventory = await this.inventoryService.create(inventoryData);
            res.status(201).json(inventory);
        } catch (error) {
            res.status(400).json({ 
                message: 'Failed to create inventory',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async updateQuantity(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { shop_id, product_plu } = req.body;
            const changes: UpdateInventoryQuantityDto = {
                shelf_quantity: req.body.shelf_quantity,
                order_quantity: req.body.order_quantity
            };

            const inventory = await this.inventoryService.updateQuantity(
                id,
                shop_id,
                product_plu,
                changes
            );
            res.json(inventory);
        } catch (error) {
            res.status(400).json({ 
                message: 'Failed to update inventory',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getInventory(req: Request, res: Response) {
        try {
            const filters = {
                plu: req.query.plu as string,
                shop_id: req.query.shop_id ? parseInt(req.query.shop_id as string) : undefined,
                shelf_quantity_from: req.query.shelf_quantity_from ? parseInt(req.query.shelf_quantity_from as string) : undefined,
                shelf_quantity_to: req.query.shelf_quantity_to ? parseInt(req.query.shelf_quantity_to as string) : undefined,
                order_quantity_from: req.query.order_quantity_from ? parseInt(req.query.order_quantity_from as string) : undefined,
                order_quantity_to: req.query.order_quantity_to ? parseInt(req.query.order_quantity_to as string) : undefined
            };

            const inventory = await this.inventoryService.findByFilters(filters);
            res.json(inventory);
        } catch (error) {
            res.status(400).json({ 
                message: 'Failed to fetch inventory',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}