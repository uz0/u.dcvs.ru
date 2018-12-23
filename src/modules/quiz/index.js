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
    };

    updateModuleData('quiz', {
        list: [...list, newQuiz],
    });

    response.output = ['new quiz created', { channelName: broadcastChannelName, message: 'hello' }];

    return response;
}

function checkQuiz(response) {
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
