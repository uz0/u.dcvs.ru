const isInteger = require('lodash/isInteger');
const isEmpty = require('lodash/isEmpty');
const command = require('../command.filter');
const isModerator = require('../isModerator');
const { getDiscordIdFromMention } = require('../helpers/discord');

const LOG_COUNT = 5;

const status = async function (req, ctx) {
    const {
        i18n,
        getModuleData,
        getUser,
        send,
    } = ctx;
    const { args: { other } } = req;

    let actualUser;
    if (other) {
        const otherId = getDiscordIdFromMention(other);
        actualUser = await getUser(otherId);
    } else {
        actualUser = req.user;
    }

    const { amount, log } = await getModuleData('exp', { user: actualUser });

    if (!isInteger(amount)) {
        throw (i18n('exp.noExp'));
    }
    if (isEmpty(log)) {
        throw (i18n('exp.noLog'));
    }

    const outLog = log
        .slice(0, LOG_COUNT)
        .map(entry => `${entry.amount}\t${entry.reason}`)
        .join('\n');

    send({
        embed: {
            title: i18n('exp.title'),
            description: i18n('exp.status', { amount }),
            fields: [
                [i18n('exp.logTitle'), outLog],
            ],
        },
    });

    return req;
};

module.exports = [
    [command('status'), status],
    [isModerator, command('status other'), status],
];
