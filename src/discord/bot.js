const _ = require('lodash');
const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('../config');
const DBL = require("dblapi.js");

// const dbl = new DBL('Your discordbots.org token', client);
const {discord: discordCfg} = config;
const token = discordCfg.credentials.authToken;
const prefix = discordCfg.prefix;

const commands = [
    {
        cmd: 'hyper',
        // answerText: '',
        // handler: () => {},
    },
    {
        cmd: 'mission',
    },
    {
        cmd: 'eth',
    },
    {
        cmd: 'balance',
    },
    {
        cmd: 'request',
    },
];

bot.on('ready', () => {
    console.log('Bot is ready to serve!');
});

bot.on('channelCreate', async channel => {
    console.log('New channel opened!');

    if (channel.type !== "dm") return;

    channel.send('Hello, new one'); //.client.user

    // no createWebhook in DMChannel

    // let wh = await channel.createWebhook("Example Webhook");
    // await wh.edit()
    // https://canary.discordapp.com/api/webhooks/${wh.id}/${wh.token}
    // channel.client.user.send(`Here is your webhook https://translate.google.ru`);

    // channel.createWebhook("Example Webhook", "https://i.imgur.com/p2qNFag.png")
    //     .then(webhook => webhook.edit("Example Webhook", "https://i.imgur.com/p2qNFag.png")
    //         .then(wb => message.author.send(`Here is your webhook https://canary.discordapp.com/api/webhooks/${wb.id}/${wb.token}`))
    //         .catch(console.error))
    //     .catch(console.error);
});

bot.on('message', async msg => {
    if (msg.author.id === bot.user.id ||
        msg.author.bot ||
        msg.channel.type !== "dm" ||
        !msg.content.startsWith(prefix)
    ) return;

    console.log('Bot received a message ' + msg.content);

    if (msg.content === '!hi') {
        msg.reply('hello there');
    }
});

bot.login(token);

// dbl.on('posted', () => {
//     console.log('Server count posted!');
// });
//
// dbl.on('error', e => {
//     console.log(`Oops! ${e}`);
// });
