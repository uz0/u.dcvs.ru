const experienceAdd = require('./experienceAdd');

async function addExpForChannelMessage(req, ctx) {
    const {
        fromKey,
        fromHuman,
        userId,
    } = req;

    const {
        i18n,
        getModuleData,
    } = ctx;

    const { channels } = await getModuleData('experience');
    const channelData = channels && channels[fromKey];

    if (!channelData) {
        return req;
    }

    req.experience = {
        targetUserId: userId,
        amount: channelData.amount,
        reason: i18n('experience.fromChannel', { fromKey: fromHuman }),
    };

    return req;
}

module.exports = [addExpForChannelMessage, experienceAdd];
