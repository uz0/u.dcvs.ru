const _ = require('lodash');
const {PREFIX} = require('../config');

function getMissionMessage(mission) {
    return `${PREFIX}${mission.command} ${mission.name} reward: ${mission.reward} ${mission.completed ? 'completed' : ''}`;
}

module.exports = async function(response, { input, db, id }) {
    return new Promise((resolve, reject) => {
        const {user} = response;
        //todo  move to init checks
        if (!user) {
            response.output = 'You\'re not logged in yet';
        }
        else {
            if (_.isEmpty(user.available)) {
                response.output = 'No available missions for now <____>';
            }
            else {
                response.output =
                    _.map(user.available, mission => getMissionMessage(mission))
                    .join('\n');
            }
        }

        resolve(response);
    });
};

module.exports.command = 'list';
