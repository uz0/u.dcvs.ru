const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');

const {
    users,
} = require('../db/mongojs_db');
const config = require('../config');
const {telegram: telegramCfg} = config;

const PREFIX = telegramCfg.prefix;

const path = `/telegram/${config.telegram.webhookEndpoint}${telegramCfg.credentials.authToken}`;
const bot = new TelegramBot(telegramCfg.credentials.authToken, {polling: true});
bot.setWebHook(`${config.url}${path}`);

const HELP_MESSAGE =`${PREFIX}mission to get a new task or get info about your current task;`;
const HELP_REQUEST = `No such command, try ${PREFIX}help`;

const MISSIONS = {
    gamer: [{
        name: 'gamer mission 1',
        steps: []
    }],
    programmer: [{
        name: 'programmer mission 1',
        steps: []
    }],
};

bot.on('message', (msg) => {
    const cmd = _.trimStart(msg.text, PREFIX);
    const userId = msg.from.id;
    let answer;

    if (!_.startsWith(msg.text, PREFIX)) {
        users.findOne({telegramId: userId}, (err, user) => {
            console.log(user);
            if (_.isEmpty(user)) {
                answer = `Please, type ${PREFIX}hiper to sign in before get a mission`;
            } else if (user.pending === 'missionChoice') {
                // todo handlers for different pending statuses
                // todo pick from available

                const choise = msg.text;
                const availableMission = user.available[choise];

                if (_.isInteger(availableMission)) {
                    users.update(
                        {telegramId: userId},
                        {
                            $set: {
                                onMission: true,
                                currentMission: MISSIONS[choise][availableMission].name,
                                missionStep: 0
                            }
                        }
                    );
                    answer = `Mission picked ${MISSIONS[choise][0].name}!\n`;
                } else {
                    answer = 'There\'s no such mission';
                }

            } else if (!user.pending) {
                answer = HELP_REQUEST;
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }

    // todo move out
    else if ('help' === cmd) {
        bot.sendMessage(msg.chat.id, HELP_MESSAGE);
    } else if ('hiper' === cmd) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (!_.isEmpty(user)) {
                answer = 'Already signed!';
            }
            else {
                // todo move out user initialization obj
                users.insert({
                    telegramId: userId,
                    available: {gamer: 0, programmer: 0}
                });
                answer = 'Successfully added!';
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    } else if ('mission' === cmd) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Please, type ${PREFIX}hiper to sign in before get a mission`;
            } else if (!user.onMission) {
                users.update(
                    {telegramId: userId},
                    {$set: {pending: 'missionChoice'}}
                );
                // todo pick from available
                answer = `Please, choose you mission:\n- gamer\n- programmer`
            } else {
                answer = `Your current mission is ${user.currentMission}`;
            }

            bot.sendMessage(msg.chat.id, answer);
        });
    } else {
        bot.sendMessage(msg.chat.id, HELP_REQUEST);
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