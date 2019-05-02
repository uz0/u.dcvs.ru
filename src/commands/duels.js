const shuffle = require('lodash/shuffle');
const command = require('../filters/command');

function getDiffInMins(dt2, dt1) {
    const diff = (dt2.getTime() - dt1.getTime()) / 1000;
    const diff2 = diff / 60;
    return Math.abs(Math.round(diff2));
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const setupDuel = async function (request, context) {
    const {
        updateModuleData,
        send,
    } = context;
    const { user, args: { opponent } } = request;

    const [, opponentId] = opponent.match(/<@(.*)>/);

    if (!opponentId) {
        return request;
    }
    const userId = user.id;
    const time = new Date();

    updateModuleData('duels', {
        [opponentId]: { userId, time },
    });

    updateModuleData('id', {
        duelerid: opponentId,
    });

    send(`${opponent}, ты вызван на дуэль! Теперь напиши 'да' или 'окей', чтобы принять свою смерть...`);

    return request;
};

const checkDuel = async function (request, context) {
    const {
        i18n,
        getModuleData,
        send,
    } = context;
    const { user, input } = request;

    const duels = await getModuleData('duels');
    const opponentId = await getModuleData('id');

    const opponentt = opponentId.duelerid;
    const curTime = new Date();
    const diff = getDiffInMins(duels[opponentt].time, curTime);

    const reply = input.toLowerCase();
    const agreeVariants = i18n('agree', { _allKeys: true });

    if (duels[opponentt].userId && agreeVariants.includes(!reply)) {
        return request;
    }

    if (duels[opponentt].userId && agreeVariants.includes(reply) && duels[opponentt].time) {
        if (diff === 0|| diff === 5) {
            const dueler1 = `<@${user.id}>`;
            const dueler2 = `<@${duels[opponentt].userId}>`;

            send(i18n('duel.hasBegun', { dueler1, dueler2 }));

            const duelers = [`<@${user.id}>`, `<@${duels[opponentt].userId}>`];
            const [winner, loser] = shuffle(duelers);

            await timeout(1000);
            send('3');
            await timeout(1000);
            send('2');
            await timeout(1000);
            send('1');
            await timeout(1000);

            send(i18n('duel.wins', { winner, loser }));

            return request;
        }

        if (diff < 5 && diff !== 0) {
            const userr = `<@${duels[opponentt].userId}>`;
            send(i18n('duel.cantDuelTwice', { userr }));
        }
    }

    return request;
};

module.exports = [
    [command('duel opponent'), setupDuel],
    checkDuel,
];
