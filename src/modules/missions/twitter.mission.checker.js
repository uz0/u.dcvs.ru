const twitter = require('./twitter.mission');
const {makeChecker} = require("./helpers");

function check(answer) {
    return true;
}

module.exports = makeChecker(twitter.missionData, check);
