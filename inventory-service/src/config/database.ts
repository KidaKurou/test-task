import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Product } from "../entities/Product";
import { Shop } from "../entities/Shop";
import { Inventory } from "../entities/Inventory";

config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [Product, Shop, Inventory],
    migrations: [],
    subscribers: [],
});