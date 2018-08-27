const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');

const {
    users,
} = require('../db/mongojs_db');
const config = require('../config');
const {telegram: telegramCfg} = config;

const TOKEN = telegramCfg.credentials.authToken;
const PREFIX = telegramCfg.prefix;

const path = `/telegram/${config.telegram.webhookEndpoint}${TOKEN}`;
const bot = new TelegramBot(TOKEN, {polling: true});
bot.setWebHook(`${config.url}${path}`);

bot.on('message', (msg) => {
    if (!_.startsWith(PREFIX, msg.text)) {
        bot.sendMessage(msg.chat.id, `Enter command, pls (${PREFIX})`);;
    }

    const cmd = _.trimStart(msg.text, PREFIX);
    const userId = msg.from.id;
    let answer;

    if ('hiper' === cmd) {
        users.find({telegramId: userId}, (err, res) => {
            if (res) {
                answer = 'Already signed!';
            }
            else {
                users.insert({telegramId: userId}, );
                answer = 'Successfully added!';
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }
});

// жмаки по кнопкам
// bot.on('callback_query', (query) => {
//     handleTelegramMsg(Object.assign({}, query.message, {
//       text: query.data,
//       from: null,
//     }));
// });

module.exports = bot;