const express = require('express');
const botApp = require('./app');

const pongModule = require('./modules/pong.command');
const hiperModule = require('./modules/hiper.command');
const helpModule = require('./modules/help.command');
const ethModule = require('./modules/eth.command');
const emptyModule = require('./modules/empty');
const userModule = require('./modules/user');

const expressApp = express();

const appInstance = botApp().register([
    // KEEP IN MIND, ORDER IMPORTANT!!!
    userModule,

    pongModule,
    hiperModule,
    helpModule,
    ethModule,

    // ITS LIKE ERROR HANDLER? NOCOMAND HANDLER OR SOMETHING LIKE
    // PLACE LAST, THEN ALL OTHER MODULES EXECUTE
    emptyModule,
]);


// telegramClient.on(({ from, text }) => {
//     const { id } = from;

//     appInstance.process({
//         input: text,
//         from: 'telegram',
//         handle({ output }) {
//             telegramClient.sendMessage(id, output);
//         },
//     })

// })

expressApp.use('/api/message', (req, res) => {
    appInstance.process({
        input: req.query.message,
        id: req.query.id,
        from: 'web',
        handle({ output }) {
            res.send(output);
        },
    });
});

module.exports = expressApp;
