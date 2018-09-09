const {makeMission} = require("./helpers");

const missionData = {
    command: 'blogpost',
    name: 'Prepare Hyperloot project overview and post it on your blog, website or other channel',
    brief: 'blogpostBriefing',
    complete: 'blogpostSuccess',
    failed: 'blogpostFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
