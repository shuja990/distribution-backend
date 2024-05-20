
exports.wrapAsync = (func) => async (req, res, next) => {
    try {
        await func(req, res);
    } catch (error) {
        return next(error);
    }
};
