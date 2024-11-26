import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';

const router = Router();
const controller = new InventoryController();

// создание остатка
router.post('/', (req, res) => controller.createInventory(req, res));

// изменение количества
router.patch('/:id/quantity', (req, res) => controller.updateQuantity(req, res));

// получение остатков по фильтрам
router.get('/', (req, res) => controller.getInventory(req, res));

export default router;