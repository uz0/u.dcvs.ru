const {isOkAnswer} = require("./helpers");
const {users} = require('../db/mongojs_db');

module.exports = [
    // {
    //     name: 'test: management',
    //     steps: [
    //         {
    //             brief: 'Briefing',
    //             managementCheckRequired: true,
    //             check: (userAnswer) => {
    //                 return isOkAnswer(userAnswer);
    //             },
    //             complete: 'Отлично! Тебе доступна следующая миссия по команде "!mission".',
    //         },
    //     ],
    //     reward: 1,
    // },
    {
        name: 'Про дискорд',
        steps: [
            {
                // todo: link to bot ?
                // todo: XXX eth
                brief: 'Давай поближе познакомимся, сперва присоединись к моему серверу в Discord, ведь я существую не только в Telegram. Я награжу тебя XXX HTL и расскажу, что требуется сделать дальше. Скажи мне свой Discord-tag.',
                check: (userAnswer, userId) => {
                    const match = userAnswer.match(/.*#(\d+)/);
                    if (match === null) {
                        return false;
                    }
                    else {
                        users.update(
                            {telegramId: userId},
                            {
                                $set: {
                                    discordId: match[1],
                                },
                            }
                        );
                        return true;
                    }
                },
                // todo: text
                complete: 'Отлично! Я запомнила твой Discord-tag. Тебе доступная следующая миссия по команде "!mission".',
            },
        ],
        reward: 1,
    },
    {
        name: 'Про манифест',
        steps: [
            {
                // todo: link
                brief: 'Прочитай манифест и подпиши петицию: %http://link%\nНапиши "ок" когда прочитаешь',
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Тебе доступна следующая миссия по команде "!mission".',
            },
        ],
        reward: 1,
    },
    {
        name: 'Про facebook',
        steps: [
            {
                // todo: link
                // todo: autocheck
                brief: 'Пользователь делает репост одной из наших публикаций в Facebook, вот наша страничка: %http://link%\nЗадание будет засчитано после подтверждения менеджером',
                // todo add facebook id to db?
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Ты выполнил все миссии в этой ветке!',
            },
        ],
        reward: 1,
    },
    // todo referal missions
    // todo android missions
];
