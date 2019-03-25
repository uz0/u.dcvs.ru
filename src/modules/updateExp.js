const { addUserExp } = require('./helpers/experience');

module.exports = async function updateExp(req, ctx) {
    const {
        from,
        userId,
    } = req;
    const {
        i18n,
        getModuleData,
    } = ctx;
    const { channels } = await getModuleData('exp');
    const currentChannel = from[1];
    const channelData = channels && channels[currentChannel];

    if (!channelData) {
        return req;
    }

    await addUserExp(ctx, userId, channelData.amount, i18n('exp.fromChannel'));

    return req;
};
