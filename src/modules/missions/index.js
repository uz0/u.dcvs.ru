const _ = require('lodash');
const telegramMission = require('./telegram.mission');
const discordMission = require('./discord.mission');
//const bitcointalkMission = require('./bitcointalk.mission');

const missions = {
    telegramMission,
    discordMission,
    //bitcointalkMission,
};

const initMissions = _.map(
    missions,
    mission => {
        return _.extend(
            _.pick(mission.missionData, ['command']),
            {answer: ''},
        );
    }
);

module.exports = {
    missions,
    initMissions,
};
