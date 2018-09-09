const {makeMission} = require("./helpers");

const missionData = {
    command: 'bitcointalk',
    name: 'Post about Hyperloot inside BitcoinTalk',
    brief: 'bitcointalkBriefing',
    complete: 'bitcointalkSuccess',
    failed: 'bitcointalkFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
