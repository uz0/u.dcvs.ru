const {makeMission} = require("./helpers");

const missionData = {
    command: 'telegram',
    name: 'join telegram',
    brief: 'tell us your telegram nickname',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
