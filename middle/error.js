const { isEmpty } = require("../utils/str_util")
const { ServiceError } = require('../modle/error.js');
module.exports = (err, req, res, next) => {
    console.log("22222222");
    console.log(err);
    if (isEmpty(err)) err = new Error('未知错误');
    // res.send({
    //     code: 400,
    //     message: err.message,
    // });'Access-Control-Expose-Headers': 'Content-Disposition',
    // res.setHeader('Access-Control-Allow-Credentials', true); 
    const code = err.statue ? err.statue : 400;
    res.status(code).send({ code, error: err.message });
}