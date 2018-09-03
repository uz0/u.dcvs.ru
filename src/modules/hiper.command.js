
module.exports = async function(response, { input, id, db }) {
    if (response.user) {
        response.output = `Вы уже авторизованы ${JSON.stringify(response.user)}`;
    }

    if (!response.user) {
        db.users.insert({
            telegramId: id,
            available: [{gamer: 0}, {programmer: 0}, {publisher: 0}, {investor: 0},],
            balance: 0,
        });

        response.output = 'Пользователь создан и авторизован';
    }

    return Promise.resolve(response);
}

module.exports.command = 'hiper';
