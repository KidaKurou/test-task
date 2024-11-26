import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { CreateProductDto } from '../interfaces';

export class ProductController {
    private productService = new ProductService();

    async createProduct(req: Request, res: Response) {
        try {
            const productData: CreateProductDto = req.body;
            const product = await this.productService.create(productData);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ 
                message: 'Failed to create product',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getProducts(req: Request, res: Response) {
        try {
            const filters = {
                name: req.query.name as string,
                plu: req.query.plu as string
            };
            
            const products = await this.productService.findByFilters(filters);
            res.json(products);
        } catch (error) {
            res.status(400).json({ 
                message: 'Failed to fetch products',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}