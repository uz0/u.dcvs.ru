
module.exports = async function(response, { input, i18n }) {
    response.output = i18n('terms');

    return response;
}

module.exports.command = 'terms';
