const {makeMission} = require("./helpers");

const missionData = {
    command: 'steemitpost',
    name: 'Make a post about the Hyperloot in Steemit',
    brief: 'steemitpostBriefing',
    complete: 'steemitpostSuccess',
    failed: 'steemitpostFail',
    reward: 1,
    needModeration: true,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
