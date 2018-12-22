
module.exports = function autoReaction(response) {
    response.reactions.push('👍');
    response.reactions.push('👎');
    response.reactions.push(':heart:');

    return response;
};
