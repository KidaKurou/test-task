import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import productRoutes from './routes/productRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Загружаем переменные окружения
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Логирование запросов

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Подключаемся к базе данных и запускаем сервер
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

export default app;