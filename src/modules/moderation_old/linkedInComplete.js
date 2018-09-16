
const _ = require('lodash');
const {updateAvailable}= require("../missions/helpers");

module.exports = async function(response, { input, id, db, i18n, handle, missions }) {
    const {user, isModerator} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (!isModerator) {
        throw('You\'re not moderator');
    }

    db.users.find({wantLinkedin: true}).forEach((err, user) => {
        handle(user.telegramId, {output: i18n('linkedinSuccess')});
        updateAvailable(db, user.telegramId, user, missions, 'linkedin');
    });

    response.output = i18n('taskChecked');

    return response;
};

module.exports.command = 'linkedin-complete';
