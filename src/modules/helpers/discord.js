function getDiscordIdFromMention(mention) {
    // cutting off discord's <@id_here>
    const match = mention.match(/<@(.*)>/);

    return match && match[1];
}

module.exports = {
    getDiscordIdFromMention,
};
