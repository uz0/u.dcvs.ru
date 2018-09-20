
const get = require('./get.command');
const moderatorCheck = require('./moderatorCheck');

const isModerator = require('./moderator');
const setmoderator = require('./setmoderator.command');
const unsetmoderator = require('./unsetmoderator.command');
<<<<<<< HEAD
// const linkedInComplete = require('./linkedInComplete');
const complete = require('./complete');
=======
const linkedInComplete = require('./linkedInComplete.command');
const complete = require('./complete.command');
>>>>>>> ac29d11e3a7be779504fd927f8e0a749f12a8cbb

module.exports = [
    isModerator,

    get,
    moderatorCheck,
    setmoderator,
    unsetmoderator,
    // linkedInComplete,
    complete,
]
