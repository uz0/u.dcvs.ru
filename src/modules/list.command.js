const _ = require('lodash');
const {PREFIX} = require('../config');

module.exports = async function(response, { input, db, id, i18n }) {
    const {user} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (_.isEmpty(user.available)) {
        throw(i18n('noMissions'))
    }

    response.output =
        _.map(user.available, mission => i18n('missionInfo', {...mission, PREFIX, completed: mission.completed ? 'completed' : ''}))
        .join('\n');

    return response;
};

module.exports.command = 'list';
