const isEmpty = require('lodash/isEmpty');

const isModerator = require('./filters/isModerator');
const command = require('./filters/command');

async function autoReaction(request, { send, getModuleData }) {
    const { channels } = await getModuleData('reactions');
    const channelData = channels && channels[String(request.from)];

    if (!channelData || isEmpty(channelData.reactions)) {
        return request;
    }

    send({ reactions: channelData.reactions });

    return request;
}

async function setupAutoReaction(req, ctx) {
    const {
        i18n,
        send,
        getModuleData,
        updateModuleData,
    } = ctx;

    const {
        from,
        args: { reactions = [] },
    } = req;

    // custom emoji passed to input contain come shit
    const filteredReactions = reactions.map((reaction) => {
        if (reaction.includes('<')) {
            // please do it more readable!
            return reaction.split(':')[2].replace(/\D+/g, '');
        }

        return reaction;
    });

    const { channels } = await getModuleData('reactions');

    await updateModuleData('reactions', {
        channels: {
            ...channels,
            [String(from)]: {
                reactions: filteredReactions,
            },
        },
    });

    send(i18n('reactions.setuped'));

    return req;
}

module.exports = [
    [isModerator, command('setupAutoReaction ...reactions'), setupAutoReaction],
    [isModerator, command('setupAutoReaction'), setupAutoReaction], // to reset
    autoReaction,
];
