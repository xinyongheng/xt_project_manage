module.exports = (req, res, next) => {
    res.cc = (err, code = 400) => {
        if (err.error) err = err.error;
        let message = err.message ? err.message : err;
        if (err.statue) {
            code = err.statue;
            message = err.message;
        }
        const errorData = { code, message };
        if (req.url == '/dataunit/uploadFiles') {
            res.status(code).send(errorData);
        } else {
            res.send(errorData);
        }
    }
    res.ss = (data = {}) => {
        const json = { code: 200, message: 'success' };
        res.send({ ...json, data });
    }
    next();
}