module.exports = {
    command: 'linkedin',
    help: 'linkedinHelp',
    brief: 'linkedinBriefing',
    reward: 1,
    init(response, { db, id }) {
        const {user} = response;

        db.users.update({
            telegramId: id,
        }, {
            $set: {
                pending: false,
                balance: user.balance + mission.reward,
                wantLinkedin: true,
                'data.linkedin.completed': true,
            },
        });

        return response;
    }
};
