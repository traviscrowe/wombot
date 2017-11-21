function encodeForQs(str) {
    return str.replace(/[^\w\d\s]/gi, '').replace(' ', '+');
}


module.exports = {
    encodeForQs
};
