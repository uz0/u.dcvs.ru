const { hri } = require('human-readable-ids');
const extend = require('lodash/extend');
const isEmpty = require('lodash/isEmpty');

const isModerator = require('../isModerator');
const command = require('../command.filter');

const missionAdd = async function (response, ctx) {
    const {
        i18n,
        getModuleData,
        updateModuleData,
        push,
    } = ctx;
    const {
        args: {
            assignee,
            checker,
            description,
            reward,
            iteration,
            requirements,
            checkerSettings,
        },
    } = response;

    if (isEmpty(assignee)) {
        throw i18n('missionAdd.noUser');
    }

    if (isEmpty(checker)) {
        throw i18n('missionAdd.noChecker');
    }

    if (isEmpty(description)) {
        throw i18n('missionAdd.noDescription');
    }

    if (isEmpty(reward)) {
        throw i18n('missionAdd.noReward');
    }

    const missionId = hri.random();

    const query = {
        id: missionId,
        assignee,
        checker,
        description,
        reward,
    };

    extend(query, { iteration: iteration || false });

    if (checkerSettings) {
        extend(query, { checkerSettings: JSON.parse(checkerSettings.replace(/'/g, '"')) });
    }

    if (requirements) {
        extend(query, { requirements });
    }

    const missionsData = await getModuleData('missions');

    if (isEmpty(missionsData)) {
        await updateModuleData(
            'missions',
            { list: [] },
        );
    }

    // TODO: encapsulate?
    await push(
        'global',
        { moduleName: 'missions' },
        { list: query },
    );

    response.output = i18n('missionAdd.success', {
        id: missionId,
        assignee: assignee === 'all' ? 'everyone' : assignee,
    });

    return response;
};

missionAdd.__INIT__ = function (context) {
    return {
        ...context,
        moderatorAdd: true,
    };
};

module.exports = [
    isModerator,
    [command('missionAdd assignee checker description reward'), missionAdd],
    [command('missionAdd assignee checker description reward checkerSettings'), missionAdd],
    [command('missionAdd assignee checker description reward checkerSettings requirements'), missionAdd],
    [command('missionAdd assignee checker description reward checkerSettings requirements iteration'), missionAdd],
];
