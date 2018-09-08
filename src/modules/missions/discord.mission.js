const {makeMission} = require("./helpers");

const missionData = {
    command: 'discord',
    name: 'join discord',
    brief: 'tell us your discord tag',
    reward: 1,
};

module.exports = makeMission(missionData);

module.exports.command = missionData.command;
module.exports.missionData = missionData;
