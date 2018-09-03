const express = require('express');
const botApp = require('./app');

const pongModule = require('./modules/pong');

const expressApp = express();

const appInstance = botApp().register([
    pongModule,
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
        from: 'web',
        handle({ output }) {
            res.send(output);
        },
    });
});

module.exports = expressApp;
