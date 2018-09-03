
module.exports = async function(response, { input }) {
    response.output = 'тут будет хелп';

    // any aditional staff here

    return Promise.resolve(response);
}

module.exports.command = 'help';
