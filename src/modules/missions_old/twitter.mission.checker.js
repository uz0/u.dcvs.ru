const twitter = require('./twitter.mission');
const {makeChecker} = require("./helpers");
const request = require("request");

async function check(answer) {
    return new Promise((resolve, reject) => {
        request(`https://twitter.com/${answer}`, (error, response, html) => {
            const hasTag = html.includes('Hyperloot');

            resolve(hasTag);
        });
    })

}

module.exports = makeChecker(twitter.missionData, check);
