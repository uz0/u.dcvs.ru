const express = require('express');
// const uuidv1 = require('uuid/v1');
// const config = require('./config');

const app = express();

// const TelegramBot = require('node-telegram-bot-api');

// web bot incoming
app.use('/api/message', function(req, res) {

  // TODO, INCOMING MESSAGE FROM WEB BOT
  // call something like process()

  res.json({ hello: true });
});

// telegram bot incoming
// const path = `/telegram/${config.telegram.webhookEndpoint}${config.telegram.credentials.authToken}`;
// const bot = new TelegramBot(config.telegram.credentials.authToken);
// bot.setWebHook(`${config.url}${path}`);

// app.post(path, (req, res) => {
//   bot.processUpdate(req.body);
//   res.sendStatus(200);
// });

// bot.on('message', handleTelegramMsg);
// bot.on('callback_query', (query) => {
//   handleTelegramMsg(Object.assign({}, query.message, {
//     text: query.data,
//     from: null,
//   }));
// });

// discord bot incoming
// TODO

// process
function process() {
  // body...
}

module.exports = app;
