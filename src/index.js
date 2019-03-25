const { discord, mongoURI } = require('./config');

const App = require('./app');

const i18n = require('./i18n');
const dbMongo = require('./db/mongo');
const dbNedb = require('./db/nedb');
const discordAdapter = require('./adapters/discord');
const httpAdapter = require('./adapters/http');

const quiz = require('./modules/quiz');
const poll = require('./modules/poll');
const wars = require('./modules/wars');

const selfReact = require('./modules/selfReact');
const error = require('./modules/error');
const event = require('./modules/event');
const autoReaction = require('./modules/autoReaction');
const log = require('./modules/log');
const updateExp = require('./modules/updateExp');

const ping = require('./modules/commands/ping');
const echo = require('./modules/commands/echo');
const expAdd = require('./modules/commands/expAdd');
const setupChannelExp = require('./modules/commands/setupChannelExp');
const status = require('./modules/commands/status');
const moderatorAdd = require('./modules/commands/moderatorAdd');
const missionAdd = require('./modules/commands/missionAdd');
const missions = require('./modules/commands/missions');

const instance = new App();

instance
    .use([i18n])
    .use(mongoURI ? [dbMongo] : [dbNedb])
    .use([httpAdapter])
    .use(discord.authToken && [discordAdapter]);


instance.use([
    log,
    updateExp,

    [
        event('message'),
        autoReaction,
    ],

    moderatorAdd,
    missionAdd,
    missions,
    ping,
    echo,
    status,
    expAdd,
    setupChannelExp,

    selfReact,

    quiz,
    poll,
    wars,
    // bets,

    // missionChecker,

    error,
]);
