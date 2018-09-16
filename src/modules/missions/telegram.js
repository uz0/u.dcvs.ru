const get = require('lodash/get');

const {telegram: {chatId, allowedStatuses}} = require('../../config');

module.exports = {
    command: 'telegram',
    help: 'telegramHelp',
    brief: 'telegramBriefing',
    complete: 'telegramSuccess',
    failed: 'telegramFail',
    reward: 1,
    needAnswer: true,
    async checker({ telegramClient }) {
        const chatMember = await telegramClient.getChatMember(chatId, id);
        const userStatus = get(chatMember, 'status');

        return allowedStatuses.includes(userStatus);
    }
};
