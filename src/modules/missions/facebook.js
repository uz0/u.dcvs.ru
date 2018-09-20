module.exports = {
    command: 'facebook',
    help: 'facebookHelp',
    brief: 'facebookBriefing',
    complete: 'facebookSuccess',
    failed: 'facebookFail',
    reward: 1,
    needAnswer: true,
    final(response, { db, id, i18n, username, input }) {
        db.users.update({
            telegramId: id,
        }, {
            $set: {
                pending: false,
                wantFacebook: true,
                'data.facebook': {
                    answer: input,
                },
            },
        });

        response.output = i18n('facebookSuccess', {username});

        return response;
    }
};
