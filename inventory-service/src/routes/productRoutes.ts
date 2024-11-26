import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const controller = new ProductController();

// создание товара
router.post('/', (req, res) => controller.createProduct(req, res));

// получение товаров по фильтрам
router.get('/', (req, res) => controller.getProducts(req, res));

export default router;