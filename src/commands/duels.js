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
        i18n,
        updateModuleData,
        send,
        getModuleData,
    } = context;
    const { user, args: { opponent } } = request;

    const [, opponentId] = opponent.match(/<@(.*)>/);

    if (!opponentId) {
        send(i18n('duel.noUser'));
    }

    updateModuleData('duels', {
        [opponentId]: {
            userId: user.id,
            time: new Date(),
        },
    });
    const get = await getModuleData('duels');

    console.log(`id is ${get.opponentId}, user id is ${get[opponentId].userId}, duel start ${get[opponentId].time}`);
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

    const opponentt = duels.opponentId;
    const curTime = new Date();
    const diff = getDiffInMins(duels[opponentt].time, curTime);
    console.log(`diff is ${diff}`);

    const reply = input.toLowerCase();
    const agreeVariants = i18n('agree', { _allKeys: true });

    if (duels[opponentt].userId && agreeVariants.includes(!reply)) {
        return request;
    }

    if (duels[opponentt].userId && agreeVariants.includes(reply) && duels[opponentt].time) {
        if (diff === 0 || diff === 5) {
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

            return request;
        }

        return request;
    }

    return request;
};

module.exports = [
    [command('duel opponent'), setupDuel],
    checkDuel,
];
