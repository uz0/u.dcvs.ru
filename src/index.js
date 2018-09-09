const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const botApp = require('./app');
const {telegram, url} = require('./config');

const pongModule = require('./modules/pong.command');
const hiperModule = require('./modules/hiper.command');
const helpModule = require('./modules/help.command');
const ethModule = require('./modules/eth.command');
const balanceModule = require('./modules/balance.command');
const listModule = require('./modules/list.command');

// const autoCheck = require('./modules/missions/autoCheck');
const telegramMission = require('./modules/missions/telegram.mission');
const discordMission = require('./modules/missions/discord.mission');
const telegramChecker = require('./modules/missions/telegram.mission.checker');
const discordChecker = require('./modules/missions/discord.mission.checker');
// const bitcointalkMission = require('./modules/missions/bitcointalk.mission');

const commonMissionBefore = require('./modules/missions/commonMissionBefore');
const emptyModule = require('./modules/empty');
const errorModule = require('./modules/error');
const userModule = require('./modules/user');

const expressApp = express();

const appInstance = botApp().register([
    // KEEP IN MIND, ORDER IMPORTANT!!!
    userModule,

    pongModule,
    hiperModule,
    helpModule,
    ethModule,
    balanceModule,
    listModule,

    telegramMission,
    discordMission,

//    autoCheck,
    telegramChecker,
    discordChecker,

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

    telegramClient.on('message', ({ from, text }) => {
        const { id } = from;

        appInstance.process({
            input: text,
            id,
            from: 'telegram',
            handle({ output }) {
                telegramClient.sendMessage(id, output);
            },
        })

    });
}

// web api, i use it for local testing
// http://localhost:3000/api/message?message=<message>&id=122657091
expressApp.use('/api/message', (req, res) => {
    appInstance.process({
        input: req.query.message,
        id: req.query.id,
        from: 'web',
        handle({ output }) {
            res.send(output);
        },
    });
});

module.exports = expressApp;
