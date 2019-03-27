const shuffle = require('lodash/shuffle');
const command = require('../command.filter');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const setupDuel = async function (request, context) {
    const { i18n, send, updateModuleData } = context;
    const { user, args: { opponent } } = request;

    const [, opponentId] = opponent.match(/<@(.*)>/);

    if (!opponentId) {
        send(i18n('duel.noUser'));
    }

    updateModuleData('duels', {
        [opponentId]: user.id,
    });

    send(`${opponent}, ты вызван на бой! Теперь напиши да, чтобы принять свою смерть...`);

    return request;
};

const checkDuel = async function (request, context) {
    const { i18n, send, getModuleData } = context;
    const { user, input } = request;

    const duels = await getModuleData('duels');

    if (duels[user.id] && input === 'да') {
        const dueler1 = `<@${user.id}>`;
        const dueler2 = `<@${duels[user.id]}>`;

        send(i18n('duel.hasBegun', { dueler1, dueler2 }));

        await timeout(1000);
        send('3');
        await timeout(1000);
        send('2');
        await timeout(1000);
        send('1');
        await timeout(1000);
        const duelers = [`<@${user.id}>`, `<@${duels[user.id]}>`];

        const [winner, loser] = shuffle(duelers);

        send(i18n('duel.wins', { winner, loser }));
    }

    return request;
};

module.exports = [
    [command('duel opponent'), setupDuel],
    checkDuel,
];
