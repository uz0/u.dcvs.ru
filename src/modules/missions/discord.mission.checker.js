const discord = require('./discord.mission');
const {makeChecker} = require("./helpers");

function check(answer) {
    const match = answer.match(/.*#(\d+)/);
    return !(match === null);
}

module.exports = makeChecker(discord.missionData, check);
