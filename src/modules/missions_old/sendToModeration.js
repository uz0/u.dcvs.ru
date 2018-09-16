// todo naming <___>

const _ = require('lodash');
const {updateModerationList} = require("./helpers");
const {unsetPending, updateAnswer, getMissionByCommand} = require("./helpers");

module.exports = async function(response, { input, id, db, i18n, missions, username }) {
    const {checked, user} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    // !response.pending -- current action is not command
    // user.pending -- we axpect an input from user
    if (!_.isBoolean(checked) && !response.pending && user.pending) {
        unsetPending(db, id);
        updateAnswer(db, id, input, user);
        updateModerationList(db, id, user, username, input);

        response.output = i18n('sendToModeration');
    }
    return Promise.resolve(response);
};
