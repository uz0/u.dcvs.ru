const {PREFIX} = require('../config');

module.exports = async function(response, { input, commands, i18n }) {
    response.output = commands
        .filter(command => command.help)
        .map(command => i18n('help', { PREFIX, ...command }))
        .join('\n')

    return response;
};

module.exports.command = 'help';
