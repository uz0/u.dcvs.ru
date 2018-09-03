const isEmpty = require('lodash/isEmpty');


module.exports = async function(response, { input }) {
    const {user} = response;

    response.output = `Твой баланс: ${user.balance}.`;

    if (isEmpty(user.eth)) {
        response.output = `Сперва мне требуется твой Ethereum адрес, чтобы перевести на него токены.
        Сообщи мне его через команду eth и далее номер через пробел.`;
    }

    return Promise.resolve(response);
}

module.exports.command = 'balance';
