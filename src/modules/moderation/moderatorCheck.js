
const isEmpty = require('lodash/isEmpty');

const accept = ['ok', 'ок'];

module.exports = async function(response, { input, id, db, i18n, handle, missions }) {
    const {user} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    const {pendingModeration} = user;

    let accepted;

    if (!isEmpty(pendingModeration)) {
        accepted = accept.includes(input);
        const messageToUser = accepted ? i18n('acceptedMission') : i18n('notAcceptedMission');

        handle(pendingModeration.id, {output: messageToUser});

        response.output = i18n('taskChecked');
    }

    if (accepted) {
        const {id: userId, command} = pendingModeration;

        db.users.findOne({telegramId: userId}, (err, moderatedUser) => {

        });
    }

    return Promise.resolve(response);
};
