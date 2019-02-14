const { admin } = require('../config');

module.exports = async function error(response, { user, username, getModuleData }) {
    const data = await getModuleData('moderation', { user });

    if (data.moderator || username === admin) {
        return response;
    }

    return null;
};
