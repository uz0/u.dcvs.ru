const { hri } = require('human-readable-ids');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');

const command = require('./command.filter');
const isModerator = require('./isModerator');

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
        id: pollId,
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
    const {
        args: {
            requestedPollId,
            requestedOption,
        } = {},
        userId,
        input,
    } = request;

    const inputLower = input.toLowerCase();
    const { voteList = [], pollList = [] } = await getModuleData('poll');
    let filteredPollList = [];
    let option = requestedOption;

    if (requestedPollId) {
        filteredPollList = pollList.filter(poll => poll.id === requestedPollId && poll.isOpen === true);
    }

    if (!requestedPollId) {
        filteredPollList = pollList.filter(poll => poll.isOpen === true);
    }

    // user input contains something in opened polls
    if (!requestedOption) {
        filteredPollList = filteredPollList.filter(poll =>
            poll.options.find(
                (pollOption) => {
                    const finded = inputLower.includes(pollOption.toLowerCase());

                    if (finded) {
                        option = pollOption;
                    }

                    return finded;
                }
            )
        )
    }

    // not direct vote and doesnt find any match in user input - silent skip
    if (!requestedOption && isEmpty(filteredPollList)) {

        return request;
    }

    const poll = filteredPollList.find(pollOption => pollOption.options.includes(option));

    if (!poll) {
        send(i18n('vote.noSuchOption'));

        return request;
    }

    const prevVoted = voteList.find(vote => vote.userId === userId && vote.pollId === poll.id);
    if (prevVoted) {
        send(i18n('poll.alreadyVoted'));

        return request;
    }

    const newVote = {
        option,
        userId,
        pollId: poll.id,
    };

    updateModuleData('poll', {
        voteList: [
            ...voteList,
            newVote,
        ],
    });

    send(i18n('vote.cast', {
        userId,
        requestedOption,
        requestPollId: newVote.pollId,
    }));

    return request;
};

const polls = async function (request, { i18n, send, getModuleData }) {
    const { pollList = [], voteList = [] } = await getModuleData('poll');
    const { args: { requestedPollId } } = request;
    let filteredPollList = [];

    if (requestedPollId) {
        filteredPollList = pollList.filter(poll => poll.id === requestedPollId && poll.isOpen);
    } else {
        filteredPollList = pollList.filter(poll => poll.isOpen);
    }

    if (isEmpty(filteredPollList)) {
        send(i18n('poll.none'));
        return request;
    }

    filteredPollList.forEach((poll) => {
        const votes = voteList.filter(vote => poll.id === vote.pollId);
        const votesCount = votes.length;

        const optionResults = poll.options.map((option) => {
            const results = votes.filter(vote => vote.option === option);
            const percentage = (results.length / votesCount * 100 || 0).toFixed(2);

            return `${option} (${percentage}%)`;
        });

        send(i18n('poll.info', {
            date: moment(poll.dateCreated).format('DD/MM'),
            description: poll.description,
            votesCount,
            pollId: poll.id,
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

    const requestedPoll = pollList.find(poll => poll.id === requestedPollId);

    if (!requestedPoll) {
        send(i18n('poll.notFound', { requestedPollId }));
        return request;
    }

    const filteredList = pollList.filter(poll => poll.id !== requestedPollId);
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
    [isModerator, command('addPoll description ...options'), addPoll],
    [isModerator, command('closePoll requestedPollId'), closePoll],
    [command('polls'), polls],
    [command('polls requestedPollId'), polls],
    [command('votePoll requestedOption'), votePoll],
    [command('votePoll requestedPollId requestedOption'), votePoll],
    votePoll,
];
