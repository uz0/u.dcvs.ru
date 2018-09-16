const isEmpty = require('lodash/isEmpty');

module.exports = async function(response, { input, i18n }) {
    const {user} = response;

    if (isEmpty(user)) {
        throw(i18n('noLogged'));
    }

    response.output = i18n('balance', { balance: user.balance });

    return response;
}

module.exports.command = 'balance';
