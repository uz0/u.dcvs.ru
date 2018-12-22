const command = require('../command');

function addQuiz(response) {
    console.log('hello i am empty module');

    return response;
}

function checkQuiz(response) {
    return response;
}

function quizList(response) {
    return response;
}

module.exports = [
    [command('quiz'), quizList],
    [command('quiz description prize ...answers'), addQuiz],
    checkQuiz,
];
