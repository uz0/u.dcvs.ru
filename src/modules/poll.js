const { hri } = require('human-readable-ids');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');
const command = require('./command.filter');

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
        dateCreated: new Date(),
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
    let openPollList = [];

    if (requestedPollId) {
        openPollList = pollList.filter(poll => poll.pollId === requestedPollId && poll.isOpen === true);
    }
    if (!requestedPollId) {
        openPollList = pollList.filter(poll => poll.isOpen === true);
    }
    const poll = openPollList
        .reverse()
        .find(pollOption => pollOption.options.includes(requestedOption));
    if (!poll) {
        send(i18n('vote.noSuchOption'));
        return request;
    }

    const prevVoted = voteList.filter(vote => vote.userId === userId && vote.pollId === poll.pollId);
    if (!isEmpty(prevVoted)) {
        send(i18n('poll.alreadyVoted'));
        return request;
    }
    const newVote = {
        option: requestedOption,
        userId,
        pollId: poll.pollId,
    };
    const requestPollId = newVote.pollId;

    updateModuleData('poll', {
        voteList: [
            ...voteList,
            newVote,
        ],
    });

    send(i18n('vote.cast', { userId, requestedOption, requestPollId }));

    return request;
};

const checkVotePoll = async function (request, {
    i18n,
    send,
    getModuleData,
    updateModuleData,
}) {
    const { input, userId } = request;
    const { pollList = [], voteList = [] } = await getModuleData('poll');
    const openPollList = pollList.filter(poll => poll.isOpen === true);
    const inputLower = input.toLowerCase();

    openPollList.forEach((poll) => {
        const prevVoted = voteList.filter(vote => vote.userId === userId && vote.pollId === poll.pollId);
        if (!isEmpty(prevVoted)) {
            return request;
        }
        if (poll.options.includes(inputLower)) {
            const requestPollId = poll.pollId;
            const requestedOption = inputLower;
            const newVote = { option: requestedOption, userId, pollId: requestPollId };

            updateModuleData('poll', {
                voteList: [
                    ...voteList,
                    newVote,
                ],
            });
            send(i18n('vote.cast', { userId, requestedOption, requestPollId }));
        }
        return request;
    });
};

const polls = async function (request, { i18n, send, getModuleData }) {
    const { pollList = [], voteList = [] } = await getModuleData('poll');
    const { args: { requestedPollId } } = request;
    let openPollList = [];

    if (requestedPollId) {
        openPollList = pollList.filter(poll => poll.pollId === requestedPollId);
    } else {
        openPollList = pollList.filter(poll => poll.isOpen);
    }

    if (isEmpty(openPollList)) {
        send(i18n('poll.none'));
        return request;
    }

    openPollList.forEach((poll) => {
        const votesCount = voteList.filter(vote => poll.pollId === vote.pollId).length;
        const optionResults = poll.options.map((requestedOption) => {
            const results = voteList.filter(vote => vote.option === requestedOption && poll.pollId === vote.pollId);
            const percentage = (results.length / votesCount * 100 || 0).toFixed(2);
            return `${requestedOption} (${percentage})`;
        });
        if (poll.isOpen === false) {
            send(i18n('closed'));
        }

        send(i18n('poll.info', {
            date: moment(poll.dateCreated).format('DD/MM'),
            description: poll.description,
            votesCount,
            pollId: poll.pollId,
            results: optionResults.join(' | '),
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
    const filteredList = pollList.filter(poll => poll.pollId !== requestedPollId);
    const closedPoll = {
        ...requestedPoll,
        isOpen: false,
    };
    updateModuleData('poll', {
        pollList: [
            ...filteredList,
            closedPoll,
        ],
    });

    send(i18n('poll.close', { requestedPollId }));

    return request;
};

module.exports = [
    [command('addPoll description ...options'), addPoll],
    [command('votePoll requestedOption'), votePoll],
    [command('votePoll requestedPollId requestedOption'), votePoll],
    [command('polls'), polls],
    [command('polls requestedPollId'), polls],
    [command('closePoll requestedPollId'), closePoll],
    checkVotePoll,
];
