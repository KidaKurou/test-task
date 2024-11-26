import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { Shop } from "./Shop";

@Entity("inventory")
export class Inventory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    product_plu!: string;

    @Column()
    shop_id!: number;

    @Column({ default: 0 })
    shelf_quantity!: number;

    @Column({ default: 0 })
    order_quantity!: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @ManyToOne(() => Product)
    @JoinColumn({ name: "product_plu", referencedColumnName: "plu" })
    product!: Product;

    @ManyToOne(() => Shop)
    @JoinColumn({ name: "shop_id" })
    shop!: Shop;
}