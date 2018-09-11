const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const botApp = require('./app');
const {telegram, url} = require('./config');

const pongModule = require('./modules/pong.command');
const startModule = require('./modules/start.command');
const helpModule = require('./modules/help.command');
const ethModule = require('./modules/eth.command');
const balanceModule = require('./modules/balance.command');
const listModule = require('./modules/list.command');
const faqModule = require('./modules/faq.command');
const supportModule = require('./modules/support.command');
const termsModule = require('./modules/terms.command');

const {missions} = require('./modules/missions');

const telegramChecker = require('./modules/missions/telegram.mission.checker');
const discordChecker = require('./modules/missions/discord.mission.checker');
const twitterChecker = require('./modules/missions/twitter.mission.checker');
const linkedinChecker = require('./modules/missions/linkedin.mission.checker');

const getModule = require('./modules/moderation/get.command');
const moderatorCheck = require('./modules/moderation/moderatorCheck');
const sendToModeration = require('./modules/missions/sendToModeration');

const commonMissionBefore = require('./modules/missions/commonMissionBefore');
const emptyModule = require('./modules/empty');
const errorModule = require('./modules/error');
const userModule = require('./modules/user');

const moderatorModule = require('./modules/moderation/moderator');
const setmoderatorModule = require('./modules/moderation/setmoderator.command');
const unsetmoderatorModule = require('./modules/moderation/unsetmoderator.command');

const expressApp = express();

const appInstance = botApp().register([
    // KEEP IN MIND, ORDER IMPORTANT!!!
    userModule,
    moderatorModule,

    startModule,
    pongModule,
    helpModule,
    ethModule,
    balanceModule,
    listModule,
    faqModule,
    supportModule,
    termsModule,

    getModule,
    setmoderatorModule,
    unsetmoderatorModule,

    ...missions,

    telegramChecker,
    discordChecker,
    twitterChecker,
    linkedinChecker,
    moderatorCheck,
    sendToModeration,

    // ITS LIKE ERROR HANDLER? NOCOMAND HANDLER OR SOMETHING LIKE
    // PLACE LAST, THEN ALL OTHER MODULES EXECUTE
    commonMissionBefore,
    emptyModule,
    errorModule,
]);

// hook with telegram
const path = `/telegram/${telegram.webhookEndpoint}${telegram.authToken}`;

if (telegram.authToken) { // for local dev purposes
    const telegramClient = new TelegramBot(telegram.authToken, {polling: true});

    telegramClient.setWebHook(`${url}${path}`);

    expressApp.post(path, (req, res) => {
        telegramClient.processUpdate(req.body);
        res.sendStatus(200);
    });

    // todo remove chat
    telegramClient.on('message', ({ from, text, chat }) => {
        const { id, username,  } = from;
        // console.log(`test chat: ${chat.id}`);

        appInstance.process({
            input: text,
            username,
            id,
            from: 'telegram',
            handle({ output }) {
                telegramClient.sendMessage(id, output);
            },
            telegramClient,
        })
    });
}

// web api, i use it for local testing
// http://localhost:3000/api/message?message=<message>&id=122657091
expressApp.use('/api/message', (req, res) => {
    appInstance.process({
        input: req.query.message,
        id: req.query.id,
        username: req.query.username,
        from: 'web',
        handle({ output }) {
            res.send(`<pre>${output}</pre>`);
        },
    });
});

module.exports = expressApp;
