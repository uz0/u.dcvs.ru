const isModerator = require('../isModerator');
const command = require('../command.filter');

const moderatorAdd = async function (response, ctx) {
    const {
        i18n,
        getUser,
        getModuleData,
        updateModuleData,
    } = ctx;
    const { args: { moderatorId } } = response;
    const moderatorUser = await getUser(moderatorId);
    const data = await getModuleData('moderation', { user: moderatorUser });

    if (data && data.moderator) {
        response.output = i18n('moderatorAdd.alreadyExist', { id: moderatorId });

        return response;
    }

    updateModuleData(
        'moderation',
        { moderator: true },
        { user: moderatorUser },
    );

    response.output = i18n('moderatorAdd.success', { id: moderatorId });

    return response;
};

moderatorAdd.__INIT__ = function (context) {
    // here we can init some methods here

    return {
        ...context,
        moderatorAdd: true,
    };
};

module.exports = [isModerator, command('moderatorAdd moderatorId'), moderatorAdd];
