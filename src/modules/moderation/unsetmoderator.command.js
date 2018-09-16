const {admin} = require('../../config');

module.exports = async function(response, { input, id, db, i18n }) {
    const {user, isModerator} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (!isModerator) {
        throw(i18n('notmoderator'));
    }

    const [, nickname] = input.split(' ');

    return new Promise((resolve, reject) => {
        db.users.findOne({telegramUsername: nickname}, (err, user) => {
            if (!user) {
                reject(i18n('noUserNickname', {nickname}));
            }

            if (nickname === admin) {
                reject(i18n('cantUnsetAdmin'));
            }

            db.users.update({telegramUsername: nickname}, {
                $set: {
                    isModerator: false,
                }
            });

            response.output = i18n('unsetModerator', {nickname});
            resolve(response);
        });
    });
};

module.exports.command = 'unsetmoderator';
