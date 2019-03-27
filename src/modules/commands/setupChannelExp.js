const isEmpty = require('lodash/isEmpty');

const isModerator = require('../isModerator');
const command = require('../command.filter');

const setupChannelExp = async function (req, ctx) {
    const {
        i18n,
        send,
        getModuleData,
        updateModuleData,
    } = ctx;
    const {
        from,
        args: { amount },
    } = req;
    const actualAmount = parseInt(amount, 10);

    if (!actualAmount) {
        throw i18n('setupChannelExp.badAmount');
    }

    const fromChannel = from[1];

    if (!fromChannel) {
        throw i18n('setupChannelExp.badChannel');
    }

    const { channels: currentChannels } = await getModuleData('exp');

    await updateModuleData('exp', {
        channels: {
            ...currentChannels,
            [fromChannel]: {
                amount: actualAmount,
            },
        },
    });

    send({
        embed: {
            title: i18n('exp.title'),
            description: i18n('setupChannelExp.description', { from, amount }),
        },
    });

    return req;
};

module.exports = [isModerator, command('setupChannelExp amount'), setupChannelExp];
