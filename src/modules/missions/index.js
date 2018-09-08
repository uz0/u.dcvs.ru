const _ = require('lodash');
const telegramMission = require('./telegram.mission');

const missions = {
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
