const {makeMission} = require("./helpers");

const missionData = {
    command: 'linkedin',
    name: 'Follow Hyperloot on LinkedIn page',
    brief: 'linkedinBriefing',
    complete: 'linkedinSuccess',
    failed: 'linkedinFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
