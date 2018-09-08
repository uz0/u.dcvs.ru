const _ = require('lodash');

const missionData = {
    command: 'telegram',
    name: 'join telegram',
    brief: 'tell us your telegram nickname',
    reward: 1,
};

module.exports = async function(response, { input, db, id }) {
    db.users.update({
        telegramId: id,
    }, {
        $set: {
            pending: missionData.command,
        },
    });

    response.output = missionData.brief;
    response.pending = missionData.command;

    return Promise.resolve(response)
};

module.exports.check = (answer) => {
    return !_.isEmpty(answer);
};
module.exports.command = missionData.command;
module.exports.missionData = missionData;
