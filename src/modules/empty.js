

module.exports = async function(response, { input }) {

    if (response.output === '') {
        response.output = 'Прости семпай я не поняла что ты хотел от меня, попробуй help или типо того';
    }

    return Promise.resolve(response);
}
