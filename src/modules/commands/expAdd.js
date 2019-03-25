const isEmpty = require('lodash/isEmpty');

const isModerator = require('../isModerator');
const command = require('../command.filter');
const { getDiscordIdFromMention } = require('../helpers/discord');
const { addUserExp } = require('../helpers/experience');

const expAdd = async function (req, ctx) {
    const {
        i18n,
        send,
    } = ctx;

    const {
        args: { target, amount, reason },
    } = req;

    if (isEmpty(target)) {
        throw i18n('expAdd.noTarget');
    }

    if (isEmpty(amount)) {
        throw i18n('expAdd.noAmount');
    }

    if (isEmpty(reason)) {
        throw i18n('expAdd.noReason');
    }

    const targetId = getDiscordIdFromMention(target);
    await addUserExp(ctx, targetId, amount, reason);

    send({
        embed: {
            title: i18n('expAdd.title'),
            description: i18n('expAdd.description', { targetId, amount, reason }),
        },
    });

    return req;
};

module.exports = [
    isModerator,
    [command('expAdd target amount reason'), expAdd],
];
