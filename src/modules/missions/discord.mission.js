const {makeMission} = require("./helpers");

const missionData = {
    command: 'discord',
    name: 'Join us on Discord channel',
    brief: 'discordBriefing',
    complete: 'discordSuccess',
    failed: 'discordFail',
    reward: 2,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
