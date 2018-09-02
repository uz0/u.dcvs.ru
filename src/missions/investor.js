const {isOkAnswer} = require("./helpers");

module.exports = [
    {
        name: 'Про токен',
        steps: [
            {
                // todo: link
                brief: 'Прочитай про то, как устроен и работает мой токен: %http://link%\nНапиши "ок" когда прочитаешь',
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Тебе доступна следующая миссия по команде "!mission".',
            },
        ]
    },
    {
        name: 'FAQ',
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
        ]
    },
    {
        name: 'Про белый список',
        steps: [
            {
                // todo: link ?
                brief: 'Заполни whitelist/kyc.\nЗадание будет засчитано после подтверждения менеджером',
                // todo managment
                check: (userAnswer) => {
                    return isOkAnswer(userAnswer);
                },
                // todo: text
                complete: 'Отлично! Ты выполнил все миссии в этой ветке!',
            },
        ]
    },
];
