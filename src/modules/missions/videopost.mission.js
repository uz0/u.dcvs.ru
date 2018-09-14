const {makeMission} = require("./helpers");

const missionData = {
    command: 'videopost',
    name: 'Video review to the project in your personal vlog',
    brief: 'videopostBriefing',
    complete: 'videopostSuccess',
    failed: 'videopostFail',
    reward: 100,
    needModeration: true,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
