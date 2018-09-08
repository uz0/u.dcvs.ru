const _ = require('lodash');
const {PREFIX} = require('../config');

function getMissionMessage(mission) {
    return `${PREFIX}${mission.command} ${mission.name} reward: ${mission.reward} ${mission.completed ? 'completed' : ''}`;
}

module.exports = async function(response, { input, db, id, i18n }) {
    const {user} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (_.isEmpty(user.available)) {
        throw(i18n('noMissions'))
    }

    response.output =
        _.map(user.available, mission => getMissionMessage(mission))
        .join('\n');

    return response;
};

module.exports.command = 'list';
