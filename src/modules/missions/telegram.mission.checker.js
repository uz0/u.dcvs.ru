const _ = require('lodash');
const {missionData} = require('./telegram.mission');
const {chatId} = require('../../config');

const allowedStatuses = ['creator', 'administrator', 'member'];

module.exports = async function(response, { input, id, i18n, username, telegramClient }) {
    const {user} = response;
    //todo  move to init checks
    if (!user) {
        throw(i18n('noLogged'));
    }

    console.log('console log driven development')

    console.log(user.pending && (user.pending === missionData.command))
    console.log(user)
    console.log(response)
    console.log(missionData)

    if (user.pending && (user.pending === missionData.command)) {
        const chatMember = await telegramClient.getChatMember(chatId, id);
        const userStatus = _.get(chatMember, 'status');

        let checked = allowedStatuses.includes(userStatus);

        response.checked = checked;
        response.output = checked ? i18n(missionData.complete, {username}) : i18n(missionData.failed, {username});
    }

    return Promise.resolve(response);
};
