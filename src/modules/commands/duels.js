const isEmpty = require('lodash/isEmpty');
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

    }

    updateModuleData('duels', {
        [opponentId]: user.id,
    })

    send('<@${opponent}>, ты вызван на бой! Теперь напиши да, чтобы принять свою смерть...');

    return request;
};

const checkDuel = async function (request, context) {
    const { i18n, send, getModuleData } = context;
    const { user, input } = request;

    const duels = getModuleData('duels');

    if (duels[user.id] && input === 'да') {

        send('бой начался! <@${duels[user.id]}> и <@{user.id}> ДА НАЧНЕТСЯ БОЙ!');

        await timeout(1000);
        send(3)
        await timeout(1000);
        send(2)
        await timeout(1000);
        send(1)
        await timeout(1000);

        send('победил!! ??');
    }
}

module.exports = [
    [command('duel opponent'), setupDuel],
    checkDuel,
];
