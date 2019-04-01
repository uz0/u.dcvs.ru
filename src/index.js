const { discord, mongoURI } = require('./config');

const App = require('./app');

const error = require('./error');
const i18n = require('./i18n');

const dbMongo = require('./db/mongo');
const dbNedb = require('./db/nedb');
const discordAdapter = require('./adapters/discord');
const httpAdapter = require('./adapters/http');

const ping = require('./commands/ping');
const fight = require('./commands/fight');
const echo = require('./commands/echo');
const moderatorAdd = require('./commands/moderatorAdd');

const quiz = require('./quiz');
const poll = require('./poll');
const selfReact = require('./selfReact');

const experience = require('./experience');

const instance = new App();

instance.use([
    i18n,
    mongoURI ? dbMongo : dbNedb,
    httpAdapter,
    [discord.authToken && discordAdapter],
]);

instance.use([
    fight,
    ping,
    echo,
    moderatorAdd,

    selfReact,
    experience,
    quiz,
    poll,
]);

instance.use([
    error,
]);