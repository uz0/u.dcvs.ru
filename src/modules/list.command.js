const _ = require('lodash');
const {PREFIX} = require('../config');

function getMissionMessage(mission) {
    return `${PREFIX}${mission.command} ${mission.name} reward: ${mission.reward} ${mission.completed ? 'completed' : ''}`;
}

module.exports = async function(response, { input, db, id }) {
    const {user} = response;

    if (!user) {
        response.output = 'You\'re not logged in yet';
    }


    if (_.isEmpty(user.available)) {
        response.output = 'No available missions for now <____>';
    }

    if (!response.output) {
        response.output =
            _.map(user.available, mission => getMissionMessage(mission))
            .join('\n');
    }

    return Promise.resolve(response);
};

module.exports.command = 'list';
