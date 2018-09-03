
module.exports = async function(response, { input }) {
    response.output = 'Ваш телеграм добавлен';

    // any aditional staff here

    return Promise.resolve(response);
}

module.exports.command = 'hiper';
