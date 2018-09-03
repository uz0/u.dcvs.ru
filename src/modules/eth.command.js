
module.exports = async function(response, { input, db, id }) {
    const regexp = input.match(/.* (\d+)/);
    const ethAdress = regexp ? regexp[1] : null;

    db.users.update({ telegramId: id }, {
        $set: {
            eth: ethAdress,
        },
    })

    response.output = `Я успешно привязала номер твоего Ethereum кошелька (${ethAdress}) к твоему аккаунту`;

    if(!ethAdress) {
        response.output = `Пожалуйста, укажи корректный номер своего ethereum-кошелька через пробел в команде: eth номер_кошелька`;
    }

    return Promise.resolve(response);
}

module.exports.command = 'eth';
