import { Request, Response, NextFunction } from 'express';

// Интерфейс для кастомной ошибки
export interface CustomError extends Error {
    statusCode?: number;
    validationErrors?: object[];
}

// Middleware для обработки ошибок
export const errorHandler = (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error('Error:', err);

    // Определяем статус ошибки
    const statusCode = err.statusCode || 500;
    
    // Формируем ответ
    const response = {
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        ...(err.validationErrors && { errors: err.validationErrors })
    };

    res.status(statusCode).json(response);
};

// Middleware для обработки несуществующих маршрутов
export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const error: CustomError = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};