const _ = require('lodash');
const telegram = require('./telegram.mission');
const {getActiveMission, getActiveMissionIndex} = require("./helpers");

function unsetPending(db, id) {
    db.users.update({telegramId: id}, {
        $unset: {
            pending: '',
        }
    });
}

function updateAnswer(db, id, input) {
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

module.exports = async function(response, { input, db, id }) {
    return new Promise((resolve, reject) => {
        const {user} = response;
        //todo  move to init checks
        if (!user) {
            response.output = 'You\'re not logged in yet';
        }
        else {
            let checked;

            if (user.pending) {
                switch (user.pending) {
                    case telegram.command:
                        checked = telegram.check(input);
                        break;
                }

                unsetPending(db, id);
                updateAnswer(db, id, input);
                if (checked) {
                    updateAvailable(db, id, user);
                }
                response.output = checked ? 'Mission completed' : 'Mission failed, try again';
            }
        }

        resolve(response);
    });
};
