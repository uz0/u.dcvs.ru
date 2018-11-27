const command = require('./command');

const ping = async function(response, { input, i18n }) {
    response.output = i18n('ping');

    return response;
};

module.exports = [command('ping'), ping];
