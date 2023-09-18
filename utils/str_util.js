function isEmpty(data) {
    if (data == null || data == undefined) return true;
    try {
        if (data.length == 0) return true;
    } catch (error) {
        return false;
    }
    return false;
}
function isInteger(obj) {
    return typeof obj === 'number' && obj % 1 === 0;
}

function toInt(data) {
    try {
        return parseInt(data)
    } catch (error) {
        return 0;
    }
}
module.exports = { isEmpty, isInteger, toInt };