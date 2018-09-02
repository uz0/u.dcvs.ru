const {isOkAnswer} = require("./helpers");
const {users} = require('../db/mongojs_db');

module.exports = [
    {
        name: 'Про видео',
        steps: [
            {
                // todo: link
                brief: 'Посмотри видео про нас: : %http://link%\nНапиши "ок" когда посмотришь',
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
        name: 'Про FAQ',
        steps: [
            {
                // todo: link
                brief: 'Прочитай FAQ: %http://link%\nНапиши "ок" когда прочитаешь',
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
        name: 'Про договор о партнерстве',
        steps: [
            {
                // todo: link
                brief: 'Подпишите договор о партнерстве: %http://link%\nНапиши "ок" когда прочитаешь',
                // todo: management
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Ты выполнил все миссии в этой ветке!".',
            },
        ],
        // todo referal
        reward: 1,
    },
    // todo 4th mission
    // {
    //     name: 'Про договор о партнерстве',
    //     steps: [
    //         {
    //             // todo: link
    //             brief: 'Подпишите договор о партнерстве: %http://link%\nНапиши "ок" когда прочитаешь',
    //             // todo: management
    //             check: (userAnswer) => {
    //                 return isOkAnswer(userAnswer);
    //             },
    //             // todo: text
    //             complete: 'Отлично! Ты выполнил все миссии в этой ветке!".',
    //         },
    //     ],
    //     // todo referal
    //     reward: 1,
    // },
];
