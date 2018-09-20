module.exports = {
    command: 'linkedin',
    help: 'linkedinHelp',
    brief: 'linkedinBriefing',
    reward: 1,
    init(response, { db, id }) {
        db.users.update({
            telegramId: id,
        }, {
            $set: {
                pending: false,
                wantLinkedin: true,
            },
        });

        return response;
    }
};
