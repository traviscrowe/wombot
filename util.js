function encodeForQs(str) {
    return str.replace(/[^\w\d\s]/gi, '').replace(' ', '+')
        .toLowerCase();
}

module.exports = {
    encodeForQs,
};
