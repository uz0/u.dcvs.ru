const express = require('express');
// const uuidv1 = require('uuid/v1');
const config = require('./config');
// const {handleTelegramMsg} = require('./telegram/handler');

const {telegram: telegramCfg} = config;
const app = express();

const TelegramBot = require('node-telegram-bot-api');

// web bot incoming
app.use('/api/message', function(req, res) {

  // TODO, INCOMING MESSAGE FROM WEB BOT
  // call something like process()

  res.json({ hello: true });
});

// telegram
const path = `/telegram/${config.telegram.webhookEndpoint}${telegramCfg.credentials.authToken}`;
const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${config.url}${path}`);

app.post(path, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// текстовые команды
bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, 'I am alive!');
});

// жмаки по кнопкам
// bot.on('callback_query', (query) => {
//     handleTelegramMsg(Object.assign({}, query.message, {
//       text: query.data,
//       from: null,
//     }));
// });

// discord bot incoming
// TODO

// process
function process() {
  // body...
}

module.exports = app;
