const experienceAdd = require('./experienceAdd');

async function addExpForChannelMessage(req, ctx) {
    const {
        from,
        userId,
    } = req;

    const {
        i18n,
        getModuleData,
    } = ctx;

    const { channels } = await getModuleData('experience');
    const channelData = channels && channels[String(from)];

    if (!channelData) {
        return req;
    }

    req.experience = {
        targetUserId: userId,
        amount: channelData.amount,
        reason: i18n('experience.fromChannel', { fromKey: from.name }),
        reasonId: `MESSAGE_${String(from)}`,
    };

    return req;
}

module.exports = [addExpForChannelMessage, experienceAdd];
