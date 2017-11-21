function encodeForQs(str) {
    return str.replace(/[^\w\d\s]/gi, '').replace(' ', '+').toLowerCase();
}

function sanitizeTicker(str) {
    return str.replace(/[^\w\d\s-]/gi, '').toUpperCase();
}


module.exports = {
    encodeForQs,
    sanitizeTicker
};
