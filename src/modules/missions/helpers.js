const _ = require('lodash');

function getActiveMissionIndex(user) {
    const {available} = user;
    return _.findIndex(available, (mission) => mission.command === user.pending);
}

function getActiveMission(user) {
    return user.available[getActiveMissionIndex(user)];
}

module.exports = {
    getActiveMission,
    getActiveMissionIndex
};
