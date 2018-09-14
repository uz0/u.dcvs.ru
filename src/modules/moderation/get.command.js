
module.exports = async function(response, { input, id, db, i18n }) {
    const {user, isModerator} = response;

    if (!user) {
        throw(i18n('noLogged'));
    }

    if (!isModerator) {
        throw('You\'re not moderator');
    }

    return new Promise((resolve, reject) => {
        db.moderation.findOne({}, (err, task) => {
            if (!task) {
                reject(i18n('noTasks'));
            }
            const {username, command, answer} = task;
            db.moderation.remove({_id: task._id});
            db.users.update({telegramId: id}, {
                $set: {
                    pendingModeration: task,
                }
            });
            response.output = `mission: ${command}\nuser: ${username}\nanswer: ${answer}`;
            resolve(response);
        });
    });
};

module.exports.command = 'get';
