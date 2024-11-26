function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    
    const response = {
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(statusCode).json(response);
}

function notFoundHandler(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

module.exports = {
    errorHandler,
    notFoundHandler
};