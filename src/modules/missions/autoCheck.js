const _ = require('lodash');
const telegram = require('./telegram.mission');

function unsetPending(db, id) {
    db.users.update({telegramId: id}, {
        $unset: {
            pending: '',
        }
    });
}

function removeFromAvailable(db, id, user) {
    let newAvailable = user.available;
    const index = _.findIndex(newAvailable, (mission) => mission.command === user.pending);
    const reward = newAvailable[index].reward;
    newAvailable.splice(index, 1);

    db.users.update({telegramId: id}, {
        $set: {
            available: newAvailable,
            balance: reward ? user.balance + reward : user.balance,
        },
    });
}

module.exports = async function(response, { input, db, id }) {
    return new Promise((resolve, reject) => {
        // db.users.findOne({
        //     telegramId: id,
        // }, (err, user) => {
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
                if (checked) {
                    removeFromAvailable(db, id, user);
                }
                response.output = checked ? 'Mission completed' : 'Mission failed, try again';
            }
        }

        resolve(response);
    });
    // });
};
