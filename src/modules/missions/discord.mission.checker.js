const discord = require('./discord.mission');
const {makeChecker} = require("./helpers");

function check(answer) {
    const match = answer.match(/.*#(\d+)/);
    console.log(match);
    return !(match === null);
}

module.exports = makeChecker(discord.command, check);
