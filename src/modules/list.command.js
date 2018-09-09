const _ = require('lodash');
const {getMissionByCommand} = require("./missions/helpers");
const {PREFIX} = require('../config');

module.exports = async function(response, { input, db, id, i18n, missions }) {
    const {user} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (_.isEmpty(user.available)) {
        throw(i18n('noMissions'))
    }

    const missionsInfo = missions.map(mission => {
        const availableMission = getMissionByCommand(user.available, mission.command);
        return _.extend(mission, {answer: availableMission.answer, completed: availableMission.completed});
    });

    response.output =
        _.map(missionsInfo, mission => i18n('missionInfo', {...mission, PREFIX, completed: mission.completed ? 'completed' : ''}))
        .join('\n');

    return response;
};

module.exports.command = 'list';
