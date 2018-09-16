const request = require('request');

module.exports = {
    command: 'twitter',
    help: 'twitterHelp',
    brief: 'twitterBriefing',
    complete: 'twitterSuccess',
    failed: 'twitterFail',
    reward: 1,
    needAnswer: true,
    checker({ input }) {
        return new Promise((resolve, reject) => {
            request(`https://twitter.com/${input}`, (error, response, html) => {
                const hasTag = html.includes('Hyperloot');

                resolve(hasTag);
            });
        })
    }
};
