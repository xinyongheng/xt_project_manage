const { isEmpty } = require("./str_util.js");
const { rasDecryptionForJson } = require("./aes.js")
const Base64 = require('js-base64');
function checkSession(req, res) {
    /* var user = req.session.user
    if (!user) {
        throw new Error('认证错误');
    } */
}
async function exceptionSync(req, res, next, fun, checkSessionTag) {
    try {
        if (checkSessionTag) checkSession(req, res);
        req = rasDecryptionBody(req);
        await fun(req, res, next);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

function exception(req, res, next, fun, checkSessionTag) {
    try {
        if (checkSessionTag) checkSession(req, res);
        fun(rasDecryptionBody(req), res, next);
    } catch (error) {
        console.log('----------------');
        console.log(error);
        next(error);
    }
}

function checkBodyParameter(req, key) {
    if (isEmpty(req.body)) throw new Error('参数缺失-body');
    if (isEmpty(req.body[key])) {
        throw new Error('参数缺失-' + key);
    }
    return req.body[key];
}

function rasDecryptionBody(req) {
    /* var cipherTag = req.headers['cipher'];
    if (cipherTag == 'true' || cipherTag == true) {
        var cipher_data = checkBodyParameter(req, 'cipher');
        // 网页解码
        cipher_data = decodeURIComponent(cipher_data);
        // base64解码
        cipher_data = Base64.decode(cipher_data);
        var jsonData = rasDecryptionForJson(cipher_data);
        req.body = jsonData;
    } */
    return req;
}
function loadToken(req) {
    return req.headers['authorization'];
}
module.exports = { exceptionSync, exception, checkBodyParameter, loadToken }