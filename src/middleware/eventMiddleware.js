function errorHandler(err, req, res, next) {
    // Basic error handler
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
}

module.exports = { errorHandler };
