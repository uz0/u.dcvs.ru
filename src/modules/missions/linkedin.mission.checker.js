const linkedin = require('./linkedin.mission');
const {makeChecker} = require("./helpers");

function check(answer) {
    return true;
}

module.exports = makeChecker(linkedin.missionData, check);
