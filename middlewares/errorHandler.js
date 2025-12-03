function errorHandler(error, req, res, next)
{
    console.log(error);

    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({error: message});
}

module.exports = errorHandler;