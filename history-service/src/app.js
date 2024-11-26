const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
const historyRoutes = require('./routes/historyRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/history', historyRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Подключаемся к базе данных и запускаем сервер
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');

        app.listen(PORT, () => {
            console.log(`History service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;