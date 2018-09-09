const _ = require('lodash');

function getMissionIndexByCommand(missionsList, command) {
    return _.findIndex(missionsList, (mission) => mission.command === command);
}

function getMissionByCommand(missionsList, command) {
    return missionsList[getMissionIndexByCommand(missionsList, command)];
}

function unsetPending(db, id) {
    db.users.update({telegramId: id}, {
        $unset: {
            pending: '',
        }
    });
}

function updateAnswer(db, id, input, user) {
    const index = getMissionIndexByCommand(user.available, user.pending);

    db.users.update({telegramId: id}, {
        $set: {
            [`available.${index}.answer`] : input,
        },
    });
}

function updateAvailable(db, id, user, missions) {
    const {available, balance, pending} = user;
    const index = getMissionIndexByCommand(available, pending);
    const {reward} = getMissionByCommand(missions, pending);

    db.users.update({telegramId: id}, {
        $set: {
            [`available.${index}.completed`] : true,
            balance: reward ? balance + reward : balance,
        },
    });

    db.users.update({telegramId: id}, {
        $push: {
            completed: pending,
        },
    });
}

function makeMission(missionData) {
    return async function(response, { input, db, id, i18n }) {
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

        response.output = i18n(missionData.brief);
        response.pending = missionData.command;

        return response;
    }
}

function makeChecker(missionData, check) {
    return async function(response, { input, i18n }) {
        const {user} = response;
        //todo  move to init checks
        if (!user) {
            throw(i18n('noLogged'));
        }

        if (user.pending && (user.pending === missionData.command)) {
            let checked = check(input);

            response.checked = checked;
            response.output = checked ? i18n(missionData.complete) : i18n(missionData.failed);
        }

        return Promise.resolve(response);
    }
}

module.exports = {
    getMissionByCommand,
    getMissionIndexByCommand,
    unsetPending,
    updateAnswer,
    updateAvailable,
    makeMission,
    makeChecker,
};
