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

// '201056374'
const managers = [];
let managersTasks = [];

const HELP_MESSAGE =
    `${PREFIX}balance\t- посмотреть текущий баланс\n` +
    `${PREFIX}eth eth_num\t- привязка ethereum кошелька с номером eth_num\n` +
    `${PREFIX}hiper\t- привязать телеграм\n` +
    `${PREFIX}mission\t- получить новое задание или просмотреть текущее\n` +
    `${PREFIX}request\t- сделать запрос на вывод средств`;
const HELP_REQUEST = `No such command, try ${PREFIX}help`;

const MISSIONS = require('../missions');
const {isOkAnswer} = require("../missions/helpers");

bot.on('message', (msg) => {
    const cmd = _.trimStart(msg.text, PREFIX);
    const userId = msg.from.id;
    let answer = '';

    if (managers.includes(userId)) {
        if (!managersTasks.length) {
            answer = 'Нет заданий для проверки';
        }
        else if (isOkAnswer(cmd)) {
            answer = 'Засчитано';
        }
        else {
            answer = 'Не засчитано';
        }
        bot.sendMessage(msg.chat.id, answer);
    }
    else if (!_.startsWith(msg.text, PREFIX)) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Пожалуйста, активируй свой аккаунт с помощью команды \n${PREFIX}hiper\nпрежде, чем мы сможем продолжить.`;
            } else if (user.pending === 'missionChoice') {
                // todo handlers for different pending statuses
                // todo pick from available
                const choice = _.parseInt(msg.text) - 1;
                const availableMission = user.available[choice];
                let missionType;
                let missionStage;

                if (availableMission) {
                    // todo >_>
                    [[missionType, missionStage]] = _.entries(availableMission);

                //}
                //if (_.isInteger(availableMission)) {
                    const pickedMission = MISSIONS[missionType][missionStage];

                    users.update(
                        {telegramId: userId},
                        {
                            $set: {
                                onMission: true,
                                // todo own pending status for each mission?
                                pending: 'mission',
                                // same format as in user.available
                                currentMission: availableMission,
                                missionStep: 0,
                            }
                        }
                    );

                    answer =
                        `Вы выбрали миссию ${pickedMission.name}!\nЗадание: ${pickedMission.steps[0].brief}`;
                } else {
                    answer = 'Миссии с таким номером нет, среди предложенных =\\';
                }
            } else if (user.pending === 'mission') {
                let {currentMission, missionStep} = user;
                let [[missionType, missionStage]] = _.entries(currentMission);
                const pickedMission = MISSIONS[missionType][missionStage];
                const currentStep = pickedMission.steps[missionStep];

                if (currentStep.check(msg.text, userId)) {
                    const completionMsg = currentStep.complete;
                    // all steps passed
                    if (missionStep + 1 == pickedMission.steps.length) {
                        let newAvailable = user.available;
                        const index = _.findIndex(newAvailable, currentMission);

                        // all missions in this type completed
                        if (missionStage + 1 == MISSIONS[missionType].length) {
                            newAvailable.splice(index, 1);
                        } else {
                            newAvailable[index] = {[missionType]: missionStage + 1};
                        }

                        users.update(
                            {telegramId: userId},
                            {
                                $set: {
                                    onMission: false,
                                    available: newAvailable,
                                },
                            }
                        );
                        users.update(
                            {telegramId: userId},
                            {
                                $unset: {
                                    pending: '',
                                    currentMission: '',
                                    missionStep: '',
                                }
                            }
                        );

                        answer = completionMsg + `\nВы выполнили миссию ${pickedMission.name}`;
                    } else {
                        answer += `\nСледующий шаг: ${pickedMission.steps[missionStep + 1].brief}`;
                        users.update(
                            {telegramId: userId},
                            {
                                $set: {
                                    missionStep: missionStep + 1,
                                }
                            }
                        );
                    }
                } else {
                    answer = pickedMission.fail ?
                        pickedMission.fail() :
                        'Проверка задания провалена :( Попробуй исправить и выслать ответ ещё раз.';
                }
            } else if (!user.pending) {
                answer = HELP_REQUEST;
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }
    // todo move out
    else if ('balance' === cmd) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Пожалуйста, активируй свой аккаунт с помощью команды \n${PREFIX}hiper\nпрежде, чем мы сможем продолжить.`;
            }
            else {
                // todo move out user initialization obj
                answer = `Твой баланс: ${user.balance}.`;
                if (_.isEmpty(user.eth)) {
                    answer += `Сперва мне требуется твой Ethereum адрес, чтобы перевести на него токены. Сообщи мне его через команду ${PREFIX}eth и далее номер через пробел.`;
                }
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }
    // todo fix on "!eth"
    else if (cmd.startsWith('eth')) {
        // todo do we need cmd with params ?
        const regexp = msg.text.match(/.* (\d+)/);
        const ethnum = regexp ? regexp[1] : null;

        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Пожалуйста, активируй свой аккаунт с помощью команды \n${PREFIX}hiper\nпрежде, чем мы сможем продолжить.`;
            }
            else if(!_.isEmpty(user.eth)) {
                answer = `Номер Ethereum кошелька: ${user.eth}`;
            }
            else if (!ethnum) {
                answer = `Пожалуйста, укажи корректный номер своего ethereum-кошелька через пробел в команде: ${PREFIX}eth номер_кошелька`;
            }
            else {
                users.update(
                    {telegramId: userId},
                    {
                        $set: {
                            eth: ethnum,
                        },
                    }
                );
                answer = `Я успешно привязала номер твоего Ethereum кошелька (${ethnum}) к твоему аккаунту`;
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }
    else if ('help' === cmd) {
        bot.sendMessage(msg.chat.id, HELP_MESSAGE);
    }
    else if ('hiper' === cmd) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (!_.isEmpty(user)) {
                answer = 'Already signed!';
            }
            else {
                // todo move out user initialization obj
                // todo remove gamer and programmer ? (for discord)
                users.insert({
                    telegramId: userId,
                    available: [{gamer: 0}, {programmer: 0}, {publisher: 0}, {investor: 0},],
                    balance: 0,
                });
                answer = `Ваш телеграм добавлен!\nВот список доступных команд:\n${HELP_MESSAGE}`;
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }
    else if ('mission' === cmd) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Пожалуйста, активируй свой аккаунт с помощью команды \n${PREFIX}hiper\nпрежде, чем мы сможем продолжить.`;
            } else if (!user.onMission) {
                // todo >_>
                // generate message from db info
                const availabilityMsg = _.reduce(
                    user.available,
                    (acc, v, i) => acc + `${i + 1}. ${Object.entries(v)[0][0]}\n`,
                    '',
                );

                if (!_.isEmpty(availabilityMsg)) {
                    users.update(
                        {telegramId: userId},
                        {$set: {pending: 'missionChoice'}}
                    );
                    answer = `Пожалуйста, выбери миссию:\n${availabilityMsg}`;
                } else {
                    answer = 'Ты выполнил все миссии, молодец!';
                }
            } else {
                // todo fix
                answer = `Текущая миссия: ${user.currentMission}`;
            }

            bot.sendMessage(msg.chat.id, answer);
        });
    }
    else if ('request' === cmd) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Пожалуйста, активируй свой аккаунт с помощью команды \n${PREFIX}hiper\nпрежде, чем мы сможем продолжить.`;
            }
            else if (_.isEmpty(user.eth)) {
                answer = `Сперва мне требуется твой Ethereum адрес, чтобы перевести на него токены. Сообщи мне его через команду ${PREFIX}eth и далее номер через пробел.`;
            }
            else {
                // todo transaction here
                answer = `Твой текущий баланс – ХХХ HTL. Чтобы получить токены на свой кошелек, воспользуйся командой ${PREFIX}request После этого запроса я сформирую транзакцию и скажу тебе точную дату получения. Учти что на все токены распространяется вестинг, это значит, что после получения они будут заморожены на срок 5 месяцев.`;
            }
            bot.sendMessage(msg.chat.id, answer);
        });
    }
    else {
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
