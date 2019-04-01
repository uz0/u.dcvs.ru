const isInteger = require('lodash/isInteger');
const isEmpty = require('lodash/isEmpty');

const isModerator = require('../filters/isModerator');
const command = require('../filters/command');

const status = async function (req, ctx) {
    const {
        i18n,
        getModuleData,
        send,
    } = ctx;

    const { user } = req;

    const { amount, log } = await getModuleData('experience', { user });

    if (!isInteger(amount) || isEmpty(log)) {
        throw (i18n('experience.noExp'));
    }

    send({
        embed: {
            title: i18n('experience.title'),
            description: i18n('experience.status', { amount }),
            fields: log.map(entry => ([
                i18n('experience.amount', { amount: entry.amount }),
                i18n('experience.reason', { reason: entry.reason }),
            ])),
        },
    });

    return req;
};

module.exports = [command('status'), status];
