const isEmpty = require('lodash/isEmpty');

const isModerator = require('../isModerator');
const command = require('../command.filter');
const { discord: { channels } } = require('../../config');

async function setDefaultsChannelExp({ updateModuleData }) {
    const channelsData = {};

    Object.keys(channels).forEach((channel) => {
        channelsData[channels[channel].id] = { amount: channels[channel].expAmount };
    });

    await updateModuleData('exp', { channels: channelsData });

    return channelsData;
}

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

    let { channels: currentChannels } = await getModuleData('exp');

    if (isEmpty(currentChannels)) {
        currentChannels = await setDefaultsChannelExp(ctx);
    }

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

module.exports = [
    isModerator, command('setupChannelExp amount'), setupChannelExp
    [command('setupChannelExp amount'), setupChannelExp],
];
