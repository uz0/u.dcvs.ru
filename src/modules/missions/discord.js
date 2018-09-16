const isEmpty = require('lodash/isEmpty');

const {discord: {guildId}} = require('../../config');

module.exports = {
    command: 'discord',
    help: 'discordHelp',
    brief: 'discordBriefing',
    complete: 'discordSuccess',
    failed: 'discordFail',
    reward: 2,
    needAnswer: true,
    checker({ input, discordClient }) {
        const guild = discordClient.guilds.get(guildId);
        const match = guild.members.filter(member =>
            member.user.username === input && !member.deleted
        );

        return checked = !isEmpty(match);
    }
};
