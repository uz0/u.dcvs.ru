const {missionData} = require('./discord.mission');
const {discord: {guildId}} = require('../../config');

module.exports = async function(response, { input, id, i18n, username, discordClient }) {
    const {user} = response;
    //todo  move to init checks
    if (!user) {
        throw(i18n('noLogged'));
    }

    if (user.pending && (user.pending === missionData.command)) {
        const guild = discordClient.guilds.get(guildId);

        const match = guild.members.filter(member =>
            member.user.username === input &&
            // member.user.discriminator === '3422' &&
            !member.deleted
        );

        let checked = !_.isEmpty(match);

        response.checked = checked;
        response.output = checked ? i18n(missionData.complete, {username}) : i18n(missionData.failed, {username});
    }

    return Promise.resolve(response);
};
