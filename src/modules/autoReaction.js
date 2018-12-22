
module.exports = function autoReaction(response) {
    response.reactions.push('👎');
    response.reactions.push('👍');

    return response;
};
