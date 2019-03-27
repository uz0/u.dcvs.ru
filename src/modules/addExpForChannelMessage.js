const addUserExp = require('./addUserExp');

async function addExpForChannelMessage(req, ctx) {
    const {
        from,
        userId,
    } = req;
    const {
        i18n,
        getModuleData,
    } = ctx;
    const { channels } = await getModuleData('exp');
    // TODO: unify from
    const currentChannel = from[1];
    const channelData = channels && channels[currentChannel];

    if (!channelData) {
        return req;
    }

    req.exp = {
        targetUserId: userId,
        amount: channelData.amount,
        reason: i18n('exp.fromChannel'),
    };

    return req;
}

module.exports = [addExpForChannelMessage, addUserExp];
