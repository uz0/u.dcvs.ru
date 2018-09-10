
module.exports = async function(response, { input }) {
    response.output = 'PONG';

    return response;
}

module.exports.command = 'ping';
