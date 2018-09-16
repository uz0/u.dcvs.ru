const linkedin = require('./missions/linkedin');

module.exports = async function(response, { db, i18n, handle }) {
    const {user, isModerator} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (!isModerator) {
        throw(i18n('notmoderator'));
    }

    db.users.find({wantLinkedin: true}).forEach((err, user) => {
        handle(user.telegramId, {output: i18n('linkedinSuccess')});

        db.users.update({
            telegramId: user.telegramId,
        }, {
            $set: {
                balance: user.balance + linkedin.reward,
                [`data.linkedin`]: {
                    completed: true,
                },
            },
        });
    });

    response.output = i18n('taskChecked');

    return response;
};

module.exports.command = 'linkedin-complete';
