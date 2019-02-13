const isEmpty = require('lodash/isEmpty');
const filter = require('lodash/filter');

const checkers = require('./checkers');

// todo: as separate module?
async function updateRequirements(ctx, mission) {
    if (isEmpty(mission.requirements)) {
        return true;
    }

    const requirementsMet = false;
    const {
        getModuleData,
        const requirementsMet = false,
        id,
        i18n,
        set,
        user,
    } = ctx;
    const { list: userMissions } = await getModuleData('missions', { user });
    const missionUserData = userMissions[mission.id];
    const { count, cooldown } = mission.requirements;
    const query = { id: mission.id };
    let baseValues;

    if (!isEmpty(missionUserData)) {
        baseValues = {
            count: 0,
            cooldown: 0,
        }
    } else {
        baseValues = missionUserData;
    }

    if (!isEmpty(count)) {
        query.extend({ count: parseInt(count, 10) });
    }

    if (!isEmpty(cooldown)) {
        query.extend({ cooldown: parseInt(cooldown, 10) });
    }

    await updateModuleData('missions', query, { user });

    return requirementsMet;
}

module.exports = async function missionChecker(response, ctx) {
    const {
        getModuleData,
        updateModuleData,
        id,
        i18n,
        set,
        user,
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

        if (actualChecker(ctx, mission.checkerSettings) && await updateRequirements(ctx, mission)) {
            await set(
                'global',
                { moduleName: 'missions', 'list.id': mission.id },
                { 'list.$.closed': true },
            );

            response.output += i18n('missionChecker.success', {
                user: `<@${id}>`,
                missionId: mission.id,
                reward: mission.reward,
            });

            response.exp += parseInt(mission.reward, 10);
        }
    }

    return response;
};
