const selfReact = async function (request, { i18n, send }) {
    const { input, userId: id, hasSelfMention } = request;

    if (hasSelfMention && input.includes('?')) {
        send(i18n('selfAnswer', { input, id }));

        return request;
    }

    if (hasSelfMention) {
        send(i18n('selfReact', { input, id }));
    }

    return request;
};


module.exports = [selfReact];
