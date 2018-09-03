
module.exports = async function(response, { input }) {
    response.output = 'PONG';

    return Promise.resolve(response);
}

module.exports.command = 'ping';
