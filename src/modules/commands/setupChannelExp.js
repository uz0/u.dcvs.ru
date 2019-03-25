const isEmpty = require('lodash/isEmpty');

const isModerator = require('../isModerator');
const command = require('../command.filter');
const { getDiscordIdFromMention } = require('../helpers/discord');
const { addUserExp } = require('../helpers/experience');

const setupChannelExp = async function (req, ctx) {
    const {
        i18n,
        send,
        from,
        getModuleData,
        updateModuleData,
    } = ctx;

    const {
        args: { amount },
    } = req;

    // let { list: data } = await getModuleData('exp');

    if (!parseInt(amount, 10)) {
        throw i18n('setupChannelExp.wrongAmount');
    }

    // const targetId = getDiscordIdFromMention(target);
    // await addUserExp(ctx, targetId, amount, reason);

    updateModuleData('exp', {
        [`channels.${from}`]: {
            amount,
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
    isModerator,
    [command('setupChannelExp amount'), setupChannelExp],
];
