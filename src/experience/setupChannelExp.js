const isEmpty = require('lodash/isEmpty');

const isModerator = require('../filters/isModerator');
const command = require('../filters/command');

const setupChannelExp = async function (req, ctx) {
    const {
        i18n,
        send,
        getModuleData,
        updateModuleData,
    } = ctx;

    const {
        fromKey,
        args: { amount },
    } = req;

    const actualAmount = parseInt(amount, 10);

    if (!actualAmount) {
        throw i18n('experience.badAmount');
    }

    const { channels } = await getModuleData('experience');

    await updateModuleData('experience', {
        channels: {
            ...channels,
            [fromKey]: {
                amount: actualAmount,
            },
        },
    });

    send({
        embed: {
            title: i18n('experience.title'),
            description: i18n('experience.setup', { fromKey, amount }),
        },
    });

    return req;
};

module.exports = [isModerator, command('setupChannelExp amount'), setupChannelExp];
