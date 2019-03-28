const random = require('lodash/random');

const funnyBan = async function (request, { i18n, send }) {
    if (random(0, 50) === 24) {
        send(i18n('ban'));
    }

    return request;
};

module.exports = funnyBan;
