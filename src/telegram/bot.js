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
    gamer: [
        {
            name: 'gamer mission 1',
            steps: [
                {
                    brief: 'Type in "correct"',
                    check: (userAnswer) => {
                        return userAnswer === 'correct';
                    },
                    complete: 'You did 1',
                },
                {
                    brief: 'Type in "answer"',
                    check: (userAnswer) => {
                        return userAnswer === 'answer';
                    },
                    complete: 'You did 2',
                },
            ]
        },
        {
            name: 'gamer mission 2',
            steps: [
                {
                    brief: 'Type in "blabla"',
                    check: (userAnswer) => {
                        return userAnswer === 'blabla';
                    }
                },
                {
                    brief: 'Type in "answer"',
                    check: (userAnswer) => {
                        return userAnswer === 'answer';
                    }
                },
            ]
        }
    ],
    programmer: [
        {
            name: 'programmer mission 1',
            steps: []
        }
    ],
};

bot.on('message', (msg) => {
    const cmd = _.trimStart(msg.text, PREFIX);
    const userId = msg.from.id;
    let answer;

    if (!_.startsWith(msg.text, PREFIX)) {
        users.findOne({telegramId: userId}, (err, user) => {
            if (_.isEmpty(user)) {
                answer = `Please, type ${PREFIX}hiper to sign in before get a mission`;
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
                        `Mission picked ${pickedMission.name}!\nTask: ${pickedMission.steps[0].brief}`;
                } else {
                    answer = 'There\'s no such mission. Please type in mission number.';
                }
            } else if (user.pending === 'mission') {
                let {currentMission, missionStep} = user;
                let [[missionType, missionStage]] = _.entries(currentMission);
                const pickedMission = MISSIONS[missionType][missionStage];
                const currentStep = pickedMission.steps[missionStep];

                if (currentStep.check(msg.text)) {
                    answer = currentStep.complete;
                    // all steps passed
                    if (missionStep + 1 == pickedMission.steps.length) {
                        let newAvailable = user.available;
                        const index = _.findIndex(newAvailable, currentMission);

                        // all missions in this type completed
                        if (missionStage == MISSIONS[missionType].length) {
                            newAvailable.splice(index, 1);
                        } else {
                            newAvailable[index] = {[missionType]: missionStage + 1};
                            // todo >_>
                            // for (let v in newAvailable) {
                            //     if (_.keys(v)[0] == )
                            // }
                        }

                        // users.update(
                        //     {telegramId: userId},
                        //     {
                        //         $set: {
                        //             onMission: false,
                        //             available: newAvailable,
                        //         },
                        //         $unset: {
                        //             pending: '',
                        //             currentMission: '',
                        //             missionStep: '',
                        //         }
                        //     }
                        // );
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

                        answer = `You complete your mission ${pickedMission.name}`;
                    } else {
                        answer += `\nNext step: ${pickedMission.steps[missionStep + 1].brief}`;
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
                    answer = 'Something\'s terribly wrong just happened';
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
                    available: [{gamer: 0}, {programmer: 0}],
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

                // todo >_>
                // generate message from db info
                const availabilityMsg = _.reduce(
                    user.available,
                    (acc, v, i) => acc + `${i + 1}. ${Object.entries(v)[0][0]}\n`,
                    '',
                );

                if (!_.isEmpty(availabilityMsg)) {
                    answer = `Please, choose you mission:\n${availabilityMsg}`;
                } else {
                    answer = 'You have no available missions now :(';
                }
            } else {
                // todo fix
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