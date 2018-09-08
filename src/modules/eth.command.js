const WAValidator = require('wallet-address-validator');

module.exports = async function(response, { input, db, id, i18n }) {
    const {user} = response;

    const [, ethAdress] = input.split(' ');

    if (!ethAdress) {
        response.output = i18n('eth', { ethAdress: user.eth });

        return response;
    }

    const isValid = WAValidator.validate(ethAdress, 'ETH');

    if (!isValid) {
        throw(i18n('ethError', { ethAdress }))
    }

    db.users.update({ telegramId: id }, {
        $set: {
            eth: ethAdress,
        },
    });

    response.output = i18n('ethUpdated', { ethAdress });

    return response;
};

module.exports.command = 'eth';
