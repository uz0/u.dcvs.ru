const discord = require('./discord.mission');
const {makeChecker} = require("./helpers");

function check(answer) {
    return true;
}

module.exports = makeChecker(discord.missionData, check);
