const { hri } = require('human-readable-ids');

const isModerator = require('../filters/isModerator');
const command = require('../filters/command');

const experienceAdd = require('./experienceAdd');

async function manualAddExpToUser(req, ctx) {
    const {
        i18n,
        send,
    } = ctx;

    const {
        args: { amount, reason },
        mentions,
    } = req;

    const targetUserId = mentions[0];
    req.experience = {
        targetUserId,
        amount,
        reason,
        reasonId: hri.random(),
    };

    send({
        embed: {
            title: i18n('experience.title'),
            description: i18n('experience.manualAdd', { targetUserId, amount, reason }),
        },
    });

    return req;
}

module.exports = [isModerator, command('expAdd target amount reason'), manualAddExpToUser, experienceAdd];
