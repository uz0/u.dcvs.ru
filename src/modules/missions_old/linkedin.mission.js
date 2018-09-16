const {makeMission} = require("./helpers");

const missionData = {
    command: 'linkedin',
    name: 'Follow Hyperloot on LinkedIn page',
    brief: 'linkedinBriefing',
    reward: 1,
};

module.exports = async function(response, { input, db, id, i18n }) {
    if (response.user.completed.includes(missionData.command)) {
        throw('You had already finished this mission');
    }

    db.users.update({
        telegramId: id,
    }, {
        $set: {
            wantLinkedin: true,
        },
    });

    response.output = i18n(missionData.brief);

    return response;
}

module.exports.command = missionData.command;
module.exports.missionData = missionData;
