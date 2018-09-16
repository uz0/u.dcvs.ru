
module.exports = async function(response, { input, username, id, db, i18n }) {
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

            db.users.update({telegramUsername: nickname}, {
                $set: {
                    isModerator: true,
                }
            });

            response.output = i18n('setModerator', {nickname});
            resolve(response);
        });
    });
};

module.exports.command = 'setmoderator';
