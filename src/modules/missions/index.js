const _ = require('lodash');
const bitcointalkMission = require('./bitcointalk.mission');
const telegramMission = require('./telegram.mission');

const missions = {
    // bitcointalkMission,
    telegramMission,
};

const initMissions = _.map(
    missions,
    mission => {
        return _.extend(
            _.pick(mission.missionData, ['command', 'name', 'brief', 'reward']),
            {answer: ''},
        );
    }
);

module.exports = {
    missions,
    initMissions,
};
