const _ = require('lodash');

function getActiveMissionIndex(user) {
    return getMissionIndexByCommand(user, user.pending);
}

function getMissionIndexByCommand(user, command) {
    const {available} = user;
    return _.findIndex(available, (mission) => mission.command === command);
}

function getActiveMission(user) {
    return user.available[getActiveMissionIndex(user)];
}

function getMissionByCommand(user, command) {
    return user.available[getMissionIndexByCommand(user, command)];
}

function unsetPending(db, id) {
    db.users.update({telegramId: id}, {
        $unset: {
            pending: '',
        }
    });
}

function updateAnswer(db, id, input, user) {
    const index = getActiveMissionIndex(user);

    db.users.update({telegramId: id}, {
        $set: {
            [`available.${index}.answer`] : input,
        },
    });
}

function updateAvailable(db, id, user) {
    const index = getActiveMissionIndex(user);
    const mission = getActiveMission(user);

    db.users.update({telegramId: id}, {
        $set: {
            [`available.${index}.completed`] : true,
            balance: mission.reward ? user.balance + mission.reward : user.balance,
        },
    });

    db.users.update({telegramId: id}, {
        $push: {
            completed: mission.command,
        },
    });
}

function makeMission(missionData) {
    return async function(response, { input, db, id }) {
        if (response.user.completed.includes(missionData.command)) {
            throw('You had already finished this mission');
        }

        db.users.update({
            telegramId: id,
        }, {
            $set: {
                pending: missionData.command,
            },
        });

        response.output = missionData.brief;
        response.pending = missionData.command;

        return response;
    }
}

function makeChecker(command, check) {
    return async function(response, { input, i18n }) {
        const {user} = response;
        //todo  move to init checks
        if (!user) {
            throw(i18n('noLogged'));
        }

        if (user.pending && (user.pending === command)) {
            let checked = check(input);

            response.checked = checked;
            response.output = checked ? 'Mission completed' : 'Mission failed, try again';
        }

        return Promise.resolve(response);
    }
}

module.exports = {
    getActiveMission,
    getActiveMissionIndex,
    getMissionByCommand,
    getMissionIndexByCommand,
    unsetPending,
    updateAnswer,
    updateAvailable,
    makeMission,
    makeChecker,
};
