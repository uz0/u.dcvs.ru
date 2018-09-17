const {missions}= require('../missions');

module.exports = async function(response, { input, id, db, i18n, telegramClient }) {
    const {user, isModerator} = response;
    if (!user) {
        throw(i18n('noLogged'));
    }

    if (!isModerator) {
        throw(i18n('notmoderator'));
    }

    const [, inputCommand, nickname] = input.split(' ');

    const mission = missions.filter(({ command }) => inputCommand === command)[0];

    if (!mission) {
        throw(i18n('noCommand'));
    }

    return new Promise((resolve, reject) => {
        db.users.findOne({telegramUsername: nickname}, (err, user) => {
            if (!user) {
                reject(i18n('noUserNickname', {nickname}));
            }

            telegramClient.sendMessage(user.telegramId, i18n(mission.complete));

            db.users.update({telegramUsername: nickname}, {
                $set: {
                    balance: user.balance + mission.reward,
                    [`data.${mission.command}`]: {
                        completed: true,
                    },
                }
            });

            response.output = i18n('manualCompleted', {command: mission.command, nickname});
            resolve(response);
        });
    });
};

module.exports.command = 'complete';
