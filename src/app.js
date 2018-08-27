const express = require('express');
// const uuidv1 = require('uuid/v1');
const config = require('./config');
// const {handleTelegramMsg} = require('./telegram/handler');
const telegramBot = require('./telegram/bot');
const {telegram: telegramCfg} = config;
const app = express();

// web bot incoming
app.use('/api/message', function(req, res) {

  // TODO, INCOMING MESSAGE FROM WEB BOT
  // call something like process()

    res.json({ hello: true });
});

// telegram
const path = `/telegram/${config.telegram.webhookEndpoint}${telegramCfg.credentials.authToken}`;
app.post(path, (req, res) => {
    telegramBot.processUpdate(req.body);
    res.sendStatus(200);
});

// discord bot incoming
// TODO

// process
function process() {
  // body...
}

module.exports = app;
