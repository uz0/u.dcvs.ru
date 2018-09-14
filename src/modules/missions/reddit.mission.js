const {makeMission} = require("./helpers");

const missionData = {
    command: 'reddit',
    name: 'Subscribe to Hyperloot on Reddit',
    brief: 'redditBriefing',
    complete: 'redditSuccess',
    failed: 'redditFail',
    reward: 2,
    needModeration: true,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
