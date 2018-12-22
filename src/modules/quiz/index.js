const command = require('../command');

function addQuiz(response, {}) {
    console.log('hello i am empty module');

    return response;
}

function checkQuiz(response) {

    return response;
}

module.exports = [
    [command('quiz description prize ...answers'), addQuiz],
    checkQuiz,
]

// for testing propo sials
module.exports.addQuiz = addQuiz;
module.exports.checkQuiz = checkQuiz;
