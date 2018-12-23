const isEqual = require('lodash/isEqual');

const command = require('../command');
const { discord: { broadcastChannelName } } = require('../../config');

async function addQuiz(response, { getModuleData, updateModuleData, id }) {
    const { args: { description, prize, answers } } = response;
    const { list = [] } = await getModuleData('quiz');

    const newQuiz = {
        authorId: id,
        isOpen: true,
        description,
        prize,
        answers,
        winnerId: null,
    };

    updateModuleData('quiz', {
        list: [...list, newQuiz],
    });

    response.output = ['new quiz created', { channelName: broadcastChannelName, message: 'hello' }];

    return response;
}

async function checkQuiz(response, {
    getModuleData,
    updateModuleData,
    input,
    id,
}) {
    const { list = [] } = await getModuleData('quiz');
    console.log('check', list)

    if (list.find(q => q.isOpen)) {
        console.log('check2');
        const output = [];

        const newList = list.map((q) => {
            if (!q.answers.includes(input)) {
                return q;
            }

            output.push({ channelName: broadcastChannelName, message: `<@${id}> winner and got ${q.prize}!!111` });

            return {
                ...q,
                isOpen: false,
                winnerId: id,
            };
        });

        if (!isEqual(list, newList)) {
            updateModuleData('quiz', {
                list: newList,
            });
        }
    }

    return response;
}

async function quizList(response, { getModuleData }) {
    const { list = [] } = await getModuleData('quiz');
    console.log('list', list);

    response.output = JSON.stringify(list);

    return response;
}

module.exports = [
    [command('quiz'), quizList],
    [command('quiz description prize ...answers'), addQuiz],
    checkQuiz,
];
