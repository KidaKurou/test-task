import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("products")
export class Product {
    @PrimaryColumn()
    plu!: string;

    @Column()
    name!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;
}