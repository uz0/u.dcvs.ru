

module.exports = async function(response, { input }) {

    if (input.includes('PING')) {
        response.output = 'PONG';
    }

    return Promise.resolve(response);
}
