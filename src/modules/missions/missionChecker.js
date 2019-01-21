const filter = require('lodash/filter');
const checkers = require('./checkers');

module.exports = async function missionChecker(response, ctx) {
    const {
        getModuleData,
        id,
        i18n,
        set,
    } = ctx;

    let { list: missions } = await getModuleData('missions');

    missions = filter(missions, mission => mission.assignee === 'all' || mission.assignee === id);
    missions = filter(missions, mission => !mission.closed);

    // eslint-disable-next-line no-restricted-syntax
    for (const mission of missions) {
        const actualChecker = checkers[mission.checker];

        if (!actualChecker) {
            throw i18n('missionChecker.badChecker');
        }

        if (actualChecker(ctx, mission.checkerSettings)) {
            await set(
                'global',
                { moduleName: 'missions', 'list.id': mission.id },
                { 'list.$.closed': true },
            );
            response.output += i18n('missionChecker.success', { reward: mission.reward });
        }
    }

    return response;
};
