const _ = require('lodash');
const telegram = require('./telegram.mission');
const {makeChecker} = require("./helpers");

function check(answer) {
    return !_.isEmpty(answer);
}

module.exports = makeChecker(telegram.missionData, check);
