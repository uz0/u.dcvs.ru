
const {admin} = require('../../config');

module.exports = async function(response, { db, id, username }) {
    return new Promise((resolve, reject) => {
        db.users.findOne({telegramId: id}, (err, user) => {
            response.isModerator = (user && user.isModerator) || username === admin;

            resolve(response);
        });
    });
};
