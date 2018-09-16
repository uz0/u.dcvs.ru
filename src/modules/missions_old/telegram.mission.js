const {makeMission} = require("./helpers");

const missionData = {
    command: 'telegram',
    name: 'Join us on Telegram chat',
    brief: 'telegramBriefing',
    complete: 'telegramSuccess',
    failed: 'telegramFail',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
