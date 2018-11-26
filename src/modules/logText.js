const reduce = require('lodash/reduce');
const extend = require('lodash/extend');

const MIN_LENGTH = 10;
const conditions = [
    msg => msg.length < MIN_LENGTH,
    msg => msg.includes(' '),
];

module.exports = async function(response, { input, db, id }) {
    const msgFit = reduce(
        conditions,
        condition => condition(input),
        true
    );

    const updateQuery = {
        $inc: {
            'data.logText.allCounter': 1,
        },
    };

    if (msgFit) {
        extend(updateQuery['$inc'], {'data.logText.fitCounter': 1})
    }

    db.users.update({discordId: id}, updateQuery);

    return response;
};

