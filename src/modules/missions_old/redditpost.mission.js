const {makeMission} = require("./helpers");

const missionData = {
    command: 'redditpost',
    name: 'Post in Reddit',
    brief: 'redditpostBriefing',
    complete: 'redditpostSuccess',
    failed: 'redditpostFail',
    reward: 20,
    needModeration: true,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
