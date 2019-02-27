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
// голосование по ид
//  -добавить поле с ид
//  -проголосовать
// баг с дублированием запроса.(выводит все по 2 раза c http запрос)
// сделать закрытие
// -добавить чекер на открытие
// -закрыть голосование
// -вывести сообщение
// предотвращение каких либо голосов в закрытом голосовании

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
        isOpen: true,
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
    const { args: { requestedPollId, requestedOption }, userId } = request;

    const { voteList = [], pollList = [] } = await getModuleData('poll');

    const openPollList = pollList.filter(poll => poll.isOpen === true);
    console.log(openPollList);

    const poll = openPollList.reverse().find(pollOption => pollOption.options.includes(requestedOption));

    if (!poll) {
        send(i18n('vote.errorNotPoll'));

        return request;
    }

    const prevVoted = voteList.find(
        vote => vote.requestedOption === requestedOption && vote.userId === userId && vote.pollId === requestedPollId,
    );

    if (prevVoted) {
        send(i18n('vote.errorPrevVoted'));

        return request;
    }
    const newVote = { requestedOption, userId, requestedPollId };

    updateModuleData('poll', {
        voteList: [
            ...voteList,
            newVote,
        ],
    });

    send(i18n('vote.cast', { userId, requestedOption, requestedPollId }));

    return request;
};

const polls = async function (request, { i18n, send, getModuleData }) {
    const { pollList = [], voteList = [] } = await getModuleData('poll');

    pollList.forEach((poll) => {
        const optionResults = poll.options.map((requestedOption) => {
            const results = voteList.filter(vote => vote.requestedOption === requestedOption);

            return `${requestedOption}:${results.length}`;
        });

        send(i18n('poll.info', {
            description: poll.description,
            results: optionResults.join(', '),
        }));
    });

    return request;
};

const closePoll = async function (request, {
    i18n,
    send,
    getModuleData,
    updateModuleData,
}) {
    const { pollList = [] } = await getModuleData('poll');
    const { args: { requestedPollId } } = request;

    const requestedPoll = pollList.find(poll => poll.pollId === requestedPollId);

    if (!requestedPoll) {
        send(i18n('poll.notFound', { requestedPollId }));
        return request;
    }

    const newList = pollList.filter(poll => poll.pollId !== requestedPollId);
    requestedPoll.isOpen = false;
    newList.push(requestedPoll);
    updateModuleData('poll', {
        pollList: newList,
    });

    send(i18n('poll.close', { requestedPollId }));

    return request;
};

module.exports = [
    [command('addPoll description ...options'), addPoll],
    [command('votePoll requestedOption'), votePoll],
    [command('votePoll requestedPollId requestedOption'), votePoll],
    [command('polls'), polls],
    [command('closePoll requestedPollId'), closePoll],
];
