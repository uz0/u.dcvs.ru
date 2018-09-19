const {PREFIX} = require('../config');

module.exports = async function(response, { input, commands, i18n }) {
    const { isModerator } = response;

    response.output = commands
        .filter(command => command.help)
        .filter(command => isModerator || !command.moderator)
        .map(command => i18n('help', { PREFIX, ...command }))
        .join('\n')

    return response;
};

module.exports.command = 'help';
