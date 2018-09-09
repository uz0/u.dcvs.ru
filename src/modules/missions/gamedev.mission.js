const {makeMission} = require("./helpers");

const missionData = {
    command: 'gamedev',
    name: 'Game Developer with min 3 years of experiecne',
    brief: 'gamedevBriefing',
    complete: 'gamedevSuccess',
    failed: 'gamedevFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
