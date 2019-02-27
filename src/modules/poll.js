const { hri } = require('human-readable-ids');
const command = require('./command.filter');
// ШАГ 1 КАРКАС
// ШАГ 2 описание структуры \ требования
// 1 создать голосование
// 1.1 данные о голосовании
// Описание голосования, варианты голосование
// 1.2 сохранить эти данные
// 1.3 ответить что сохранили


// 2 проголосовать
// 2.1 собрать данные
// 2.2 обновить запись о голосе
// 2.3 сообщить что результат засчитан


// 3 посмотреть результат
// вывести все голосования и
// подсчитать количество голосов для каждого варианта

// ШАГ 3 реализация базового функционала

// ШАГ 4 написание тестов для базового функционала

// ШАГ 5 расписать список хотелок

// один юзер не может голосовать дважды!
// привязать вариант ответа, к голосованию
// создать и вернуть ид голосования в чат при создании.
// ...
// ...
// ...
// ...

// ШАГ N описать что хотелка делает (с шага 2 по шаг 4)

const addPoll = async function (request, {
    i18n,
    send,
    updateModuleData,
    getModuleData,
}) {
    const { args: { description, options } } = request;
    const pollId = hri.random();
    const newPoll = {
        description,
        options,
        pollId,
    };

    const { pollList = [] } = await getModuleData('poll');

    updateModuleData('poll', {
        pollList: [
            ...pollList,
            newPoll,
        ],
    });

    send(i18n('poll.created', { pollId }));

    return request;
};

const votePoll = async function (request, {
    i18n,
    send,
    updateModuleData,
    getModuleData,
}) {
    const { args: { option }, userId } = request;

    const { voteList = [], pollList = [] } = await getModuleData('poll');

    const poll = pollList.reverse().find(pollOption => pollOption.options.includes(option));

    if (!poll) {
        send(i18n('vote.errorNotPoll'));

        return request;
    }

    const newVote = { option, userId, pollId: poll.pollId };

    const prevVoted = voteList.find(
        vote => vote.option === option && vote.userId === userId && vote.pollId === poll.pollId,
    );
    console.log(prevVoted);

    if (prevVoted) {
        send(i18n('vote.errorPrevVoted'));

        return request;
    }

    updateModuleData('poll', {
        voteList: [
            ...voteList,
            newVote,
        ],
    });

    send(i18n('vote.cast'));

    return request;
};

const polls = async function (request, { i18n, send, getModuleData }) {
    const { pollList = [], voteList = [] } = await getModuleData('poll');

    pollList.forEach((poll) => {
        const optionResults = poll.options.map((option) => {
            const results = voteList.filter(vote => vote.option === option);

            return `${option}:${results.length}`;
        });

        send(i18n('poll.info', {
            description: poll.description,
            results: optionResults.join(', '),
        }));
    });

    return request;
};

module.exports = [
    [command('addPoll description ...options'), addPoll],
    [command('votePoll option'), votePoll],
    [command('polls'), polls],
];
