const command = require('../command');

function quiz(response) {
    console.log('hello i am empty module');

    return response;
}

module.exports = [command('quiz description prize ...answers'), quiz];
