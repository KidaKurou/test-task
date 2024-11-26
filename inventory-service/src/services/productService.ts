import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { CreateProductDto, ProductFilters } from '../interfaces';
import { Like } from 'typeorm';

export class ProductService {
    private productRepository = AppDataSource.getRepository(Product);

    async create(productData: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(productData);
        return await this.productRepository.save(product);
    }

    async findByFilters(filters: ProductFilters): Promise<Product[]> {
        const whereClause: any = {};
        
        if (filters.plu) {
            whereClause.plu = filters.plu;
        }
        
        if (filters.name) {
            whereClause.name = Like(`%${filters.name}%`);
        }

        return await this.productRepository.find({
            where: whereClause
        });
    }

    async findByPlu(plu: string): Promise<Product | null> {
        return await this.productRepository.findOne({
            where: { plu }
        });
    }
}