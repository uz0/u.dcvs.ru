const {makeMission} = require("./helpers");

const missionData = {
    command: 'twitter',
    name: 'Follow Twitter and Re-tweet',
    brief: 'twitterBriefing',
    complete: 'twitterSuccess',
    failed: 'twitterFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
