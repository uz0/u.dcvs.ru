const {initMissions} = require('./missions');

module.exports = async function(response, { input, id, db }) {
    if (response.user) {
        response.output = `Вы уже авторизованы ${JSON.stringify(response.user)}`;
    }

    if (!response.user) {
        const newUser = {
            telegramId: id,
            isManager: false,
            available: initMissions,
            completed: [],
            balance: 0,
        };
        db.users.insert(newUser);

        response.user = newUser;
        response.output = 'User has been created';
    }

    return Promise.resolve(response);
};

module.exports.command = 'start';
