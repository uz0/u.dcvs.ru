// const _ = require('lodash');
const {missionData} = require('./telegram.mission');
const {chatId} = require('../../config');

module.exports = async function(response, { input, id, i18n, telegramClient }) {
    const {user} = response;
    //todo  move to init checks
    if (!user) {
        throw(i18n('noLogged'));
    }

    if (user.pending && (user.pending === missionData.command)) {
        const chatMember = await telegramClient.getChatMember(chatId, id);
        console.log(chatMember);
        let checked = !!chatMember.user;

        response.checked = checked;
        response.output = checked ? i18n(missionData.complete) : i18n(missionData.failed);
    }

    return Promise.resolve(response);
};
