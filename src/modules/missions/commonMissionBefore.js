// todo naming <___>

const _ = require('lodash');
const {unsetPending, updateAnswer, updateAvailable} = require("./helpers");

module.exports = async function(response, { input, db, id, missions }) {
    const {checked, user} = response;

    if (_.isBoolean(checked)) {
        unsetPending(db, id);
        updateAnswer(db, id, input, user);
        if (checked) {
            updateAvailable(db, id, user, missions, user.pending);
        }
    }

    return Promise.resolve(response);
};
