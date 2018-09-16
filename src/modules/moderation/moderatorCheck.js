
const isEmpty = require('lodash/isEmpty');
const {missions}= require('../missions');

const accept = ['ok', 'ок'];

module.exports = async function(response, { input, id, db, i18n, telegramClient }) {
    const {user, isModerator} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    const {pendingModeration} = user;
    if (!pendingModeration) {
        return response;
    }

    if (!isModerator) {
        throw(i18n('notmoderator'));
    }

    const mission = missions.filter(({ command }) => pendingModeration.command === command)[0];

    const accepted = accept.includes(input);
    const messageToUser = accepted ? i18n(mission.complete) : i18n(mission.failed);
    const messageToModerator = accepted ? i18n('taskCheckedOk') : i18n('taskCheckedFailed');

    // telegramClient.sendMessage(pendingModeration.id, messageToUser);

    db.users.update({telegramId: id}, {
        $set: {
            pendingModeration: false,
        }
    });

    response.output = messageToModerator;

    if (accepted) {
        db.users.findOne({telegramId: pendingModeration.id}, (err, moderatedUser) => {
            db.users.update({
                telegramId: pendingModeration.id,
            }, {
                $set: {
                    balance,
                    [`data.${mission.command}`]: {
                        balance: moderatedUser.balance + mission.reward,
                        completed: true,
                    },
                },
            });
        });
    }

    return response;
};
