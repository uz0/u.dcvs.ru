const _ = require('lodash');
const twitterMission = require('./twitter.mission');
const linkedinMission = require('./linkedin.mission');
const telegramMission = require('./telegram.mission');
const discordMission = require('./discord.mission');
const bitcointalkMission = require('./bitcointalk.mission');
const redditMission = require('./reddit.mission');
const blogpostMission = require('./blogpost.mission');
const steemitpostMission = require('./steemitpost.mission');
const redditpostMission = require('./redditpost.mission');
const videopostMission = require('./videopost.mission');
const gamedevMission = require('./gamedev.mission');
const integrationMission = require('./integration.mission');

//const bitcointalkMission = require('./bitcointalk.mission');

const missions = [
    twitterMission,
    linkedinMission,
    telegramMission,
    discordMission,
    bitcointalkMission,
    redditMission,
    blogpostMission,
    steemitpostMission,
    redditpostMission,
    videopostMission,
    gamedevMission,
    integrationMission,
];

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
