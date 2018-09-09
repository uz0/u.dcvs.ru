
const _ = require('lodash');
const {unsetModerationPending, updateAvailable}= require("../missions/helpers");

const accept = ['ok', 'ок'];

module.exports = async function(response, { input, id, db, i18n, handle, missions }) {
    const {user} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    const {pendingModeration} = user;
    let accepted;
    if (!_.isEmpty(pendingModeration)) {
        accepted = accept.includes(input);
        const messageToUser = accepted ? i18n('acceptedMission') : i18n('notAcceptedMission');

        unsetModerationPending(db, id);

        handle(pendingModeration.id, {output: messageToUser});

        response.output = i18n('taskChecked');
    }

    if (accepted) {
        const {id: userId, command} = pendingModeration;

        db.users.findOne({telegramId: userId}, (err, moderatedUser) => {
            updateAvailable(db, userId, moderatedUser, missions, command);
        });
    }

    return Promise.resolve(response);
};
