const expCap = 50;

module.exports = function(response, { id, db }) {
    const { exp } = response;

    if (!exp) {
        return response;
    }

    return new Promise((resolve, reject) => {
        db.users.findOne({discordId: id}, (err, user) => {

            db.users.update({
                discordId: id,
            }, {
                $inc: {
                    'data.exp': exp,
                },
                $set: {
// TODO
                }
            });

            resolve(response);
        });
    });
};
