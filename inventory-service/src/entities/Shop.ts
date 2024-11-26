import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("shops")
export class Shop {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;
}