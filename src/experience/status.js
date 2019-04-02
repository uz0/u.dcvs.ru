const isInteger = require('lodash/isInteger');
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');
const values = require('lodash/values');

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

    const filteredLog = log
        .filter(entry => entry)
        .reduce((grouped, current) => {
            const { reasonId, amount: currentAmount, reason } = current;

            let key = reasonId || 'UNDEFINED';
            if (key.includes('undefined')) {
                key = 'UNDEFINED';
            }

            // eslint-disable-next-line no-param-reassign
            grouped[key] = {
                ...get(grouped, key, {}),
                amount: get(grouped, [key, 'amount'], 0) + currentAmount,
                reason: key === 'UNDEFINED' ? i18n('experience.undefined') : reason,
            };

            return grouped;
        }, {});

    send({
        embed: {
            title: i18n('experience.title'),
            description: i18n('experience.status', { amount }),
            fields: values(filteredLog).map(entry => ([
                i18n('experience.amount', { amount: entry.amount }),
                i18n('experience.reason', { reason: entry.reason }),
            ])),
        },
    });

    return req;
};

module.exports = [command('status'), status];
