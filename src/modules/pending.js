
module.exports = async function(response, { input, db, id }) {
    const {user} = response;

    if (user.pending) {
        db.users.update({telegramId: id}, {
            $set: {
                pending: false,
                [`data.${user.pending}.answer`]: input,
            },
        });

        if (!user.data[user.pending]) {
            user.data[user.pending] = {};
        }

        user.data[user.pending].answer = input;

        user.pending = false;
    }

    return response;
};

