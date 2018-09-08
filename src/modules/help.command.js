
module.exports = async function(response, { input }) {
    response.output = `
        /balance\t- посмотреть текущий баланс
        /eth eth_num\t- привязка ethereum кошелька с номером eth_num
        /hiper\t- привязать телеграм
        /mission\t- получить новое задание или просмотреть текущее
        /request\t- сделать запрос на вывод средств
    `;

    // any aditional staff here

    return Promise.resolve(response);
};

module.exports.command = 'help';
