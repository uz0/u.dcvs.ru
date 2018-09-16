const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const discordClient = require('./discordBot');

const botApp = require('./app');
const {telegram, url} = require('./config');

const userModule = require('./modules/user');
const errorModule = require('./modules/error');
const emptyModule = require('./modules/empty');

const startModule = require('./modules/start.command');
const pongModule = require('./modules/pong.command');
const helpModule = require('./modules/help.command');
const ethModule = require('./modules/eth.command');
const balanceModule = require('./modules/balance.command');
const listModule = require('./modules/list.command');
const faqModule = require('./modules/faq.command');
const supportModule = require('./modules/support.command');
const termsModule = require('./modules/terms.command');

const expressApp = express();

const appInstance = botApp().register([
    // KEEP IN MIND, ORDER IMPORTANT!!!
    // userModule,

    // startModule,
    // pongModule,
    // helpModule,
    // ethModule,
    // balanceModule,
    // listModule,
    // faqModule,
    // supportModule,
    // termsModule,

    // ITS LIKE ERROR HANDLER? NOCOMAND HANDLER OR SOMETHING LIKE
    // PLACE LAST, THEN ALL OTHER MODULES EXECUTE
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

    telegramClient.on('message', ({ from, text, chat }) => {
        const { id, username,  } = from;

        appInstance.process({
            input: text,
            username,
            id,
            from: 'telegram',
            handle({ output }) {
                telegramClient.sendMessage(id, output);
            },
            telegramClient,
            discordClient,
        });
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
