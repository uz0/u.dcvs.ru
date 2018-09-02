const {isOkAnswer} = require("./helpers");
const {users} = require('../db/mongojs_db');

module.exports = [
    {
        name: 'Про дискорд',
        steps: [
            {
                // todo: link to bot ?
                // todo: XXX eth
                brief: 'Давай поближе познакомимся, сперва присоединись к моему серверу в Telegram, ведь я существую не только в Discord. Я награжу тебя XXX HTL и расскажу, что требуется сделать дальше.',
                check: (userAnswer, userId) => {
                    const match = userAnswer.match(/\d+/)[0];
                    if (match === null) {
                        return false;
                    }
                    else {
                        // todo update
                        // users.update(
                        //     {telegramId: userId},
                        //     {
                        //         $set: {
                        //             discordId: userAnswer,
                        //         },
                        //     }
                        // );
                        return true;
                    }
                },
                // todo: text
                complete: 'Отлично! Я запомнила твой telegram аккаунт. Тебе доступная следующая миссия по команде "!mission".',
            },
        ],
        reward: 1,
    },
    {
        name: 'Про вакансии и департаменты',
        steps: [
            {
                // todo: link
                brief: 'Прочитай список вакансий и департаментов: %http://link%\nНапиши "ок" когда прочитаешь',
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
        name: 'Про форму для вакансии',
        steps: [
            {
                // todo: link
                // todo: autocheck
                brief: 'Заполни форму для вакансий: %http://link%\\nНапиши "ок" когда прочитаешь\'',
                // todo management
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Тебе доступна следующая миссия по команде "!mission".',
            },
        ],
        // todo referal
        reward: 1,
    },
    {
        name: 'Про github',
        steps: [
            {
                // todo: link
                // todo: autocheck
                brief: 'Присоединяйся к нашему github: %http://link%\\nНапиши "ок" когда прочитаешь\'',
                // todo management
                // todo add github account to db?
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Ты выполнил все миссии в этой ветке!',
            },
        ],
        // todo referal
        reward: 1,
    },
];
