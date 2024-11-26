import { AppDataSource } from '../config/database';
import { Inventory } from '../entities/Inventory';
import { CreateInventoryDto, InventoryFilters, UpdateInventoryQuantityDto, InventoryEvent } from '../interfaces';
import { Between } from 'typeorm';
import axios from 'axios';

export class InventoryService {
    private inventoryRepository = AppDataSource.getRepository(Inventory);
    private historyServiceUrl = 'http://history-service:3001'; // URL сервиса истории

    async create(data: CreateInventoryDto): Promise<Inventory> {
        const inventory = this.inventoryRepository.create(data);
        const savedInventory = await this.inventoryRepository.save(inventory);
        
        // Отправляем событие в сервис истории
        await this.sendEventToHistory({
            shop_id: savedInventory.shop_id,
            plu: savedInventory.product_plu,
            action: 'CREATE',
            changes: {
                shelf_quantity: {
                    after: savedInventory.shelf_quantity
                },
                order_quantity: {
                    after: savedInventory.order_quantity
                }
            },
            timestamp: new Date()
        });

        return savedInventory;
    }

    async updateQuantity(
        id: number, 
        shop_id: number,
        product_plu: string, 
        changes: UpdateInventoryQuantityDto
    ): Promise<Inventory> {
        const inventory = await this.inventoryRepository.findOne({
            where: { id }
        });

        if (!inventory) {
            throw new Error('Inventory not found');
        }

        const oldValues = {
            shelf_quantity: inventory.shelf_quantity,
            order_quantity: inventory.order_quantity
        };

        // Обновляем значения
        if (typeof changes.shelf_quantity === 'number') {
            inventory.shelf_quantity = changes.shelf_quantity;
        }
        if (typeof changes.order_quantity === 'number') {
            inventory.order_quantity = changes.order_quantity;
        }

        const updatedInventory = await this.inventoryRepository.save(inventory);

        // Отправляем событие в сервис истории
        await this.sendEventToHistory({
            shop_id,
            plu: product_plu,
            action: 'UPDATE',
            changes: {
                shelf_quantity: {
                    before: oldValues.shelf_quantity,
                    after: updatedInventory.shelf_quantity
                },
                order_quantity: {
                    before: oldValues.order_quantity,
                    after: updatedInventory.order_quantity
                }
            },
            timestamp: new Date()
        });

        return updatedInventory;
    }

    async findByFilters(filters: InventoryFilters): Promise<Inventory[]> {
        const whereClause: any = {};

        if (filters.plu) {
            whereClause.product_plu = filters.plu;
        }

        if (filters.shop_id) {
            whereClause.shop_id = filters.shop_id;
        }

        if (filters.shelf_quantity_from !== undefined && filters.shelf_quantity_to !== undefined) {
            whereClause.shelf_quantity = Between(filters.shelf_quantity_from, filters.shelf_quantity_to);
        }

        if (filters.order_quantity_from !== undefined && filters.order_quantity_to !== undefined) {
            whereClause.order_quantity = Between(filters.order_quantity_from, filters.order_quantity_to);
        }

        return await this.inventoryRepository.find({
            where: whereClause,
            relations: ['product', 'shop']
        });
    }

    private async sendEventToHistory(event: InventoryEvent): Promise<void> {
        try {
            await axios.post(`${this.historyServiceUrl}/api/history`, event);
        } catch (error) {
            console.error('Failed to send event to history service:', error);
            // В реальном приложении здесь можно добавить механизм повторных попыток
            // или сохранение событий в локальную очередь
        }
    }
}