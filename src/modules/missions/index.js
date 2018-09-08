const _ = require('lodash');
const telegramMission = require('./telegram.mission');
const discordMission = require('./discord.mission');

const missions = {
    telegramMission,
    discordMission,
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
