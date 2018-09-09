const {makeMission} = require("./helpers");

const missionData = {
    command: 'integration',
    name: 'Game Integration Bounty ($1000 for integrating first 50 games with Hyperloot SDK)',
    brief: 'integrationBriefing',
    complete: 'integrationSuccess',
    failed: 'integrationFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
