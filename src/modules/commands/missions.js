const isEmpty = require('lodash/isEmpty');
const filter = require('lodash/filter');

const command = require('../command.filter');

const missions = async function (response, ctx) {
    const {
        id,
        getModuleData,
        i18n,
    } = ctx;

    let { list: data } = await getModuleData('missions');
    data = filter(data, mission => mission.assignee === 'all' || mission.assignee === id);
    data = filter(data, mission => !mission.closed);
    if (isEmpty(data)) {
        response.output = i18n('missions.empty');
        return response;
    }

    data.forEach((mission) => {
        const {
            id: missionId,
            description,
            reward,
            details,
        } = mission;

        response.output += i18n('missions.list', {
            id: missionId,
            description,
            reward,
            details,
        });
    });

    return response;
};

missions.__INIT__ = function (context) {
    return {
        ...context,
        missions: true,
    };
};

module.exports = [command('missions'), missions];
