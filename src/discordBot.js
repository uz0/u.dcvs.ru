const _ = require('lodash');
const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('./config');
const {i18nFactory} = require('./i18n');
const i18n = i18nFactory();

const {discord: discordCfg} = config;
const token = discordCfg.authToken;

bot.on('ready', () => {
    console.log('Discord bot is ready to serve!');
});

bot.on('guildMemberAdd', (member) => {
    console.log(`New guild member added: ${member.user.id}`);
    const guild = member.guild;
    const defaultChannel = guild.channels.find(channel => channel.id === discordCfg.greetingsChannelId);

    if (defaultChannel) {
        defaultChannel.send(i18n('guildMemberAdd', {id: member.user.id}));
    }
});

// bot.on('channelCreate', async channel => {
//     console.log('New channel opened!');
//
//     if (channel.type !== "dm") return;
//
//     channel.send('Hello, new one');
// });
//
// bot.on('message', async msg => {
//     // if (msg.author.id === bot.user.id ||
//     //     msg.author.bot ||
//     //     msg.channel.type !== "dm" ||
//     //     !msg.content.startsWith(PREFIX)
//     // ) return;
//
//     const guild = bot.guilds.get('292411714069331969');
//
//     const match = guild.members.filter(member =>
//         member.user.username === 'dcversus' &&
//         // member.user.discriminator === '3422' &&
//         !member.deleted
//     );
//     if (!_.isEmpty(match)) {
//         console.log('match!');
//     }
//     else {
//         console.log('fail!');
//     }
//     console.log('Bot received a message ' + msg.content);
//
//     if (msg.content === '!hi') {
//         msg.reply('hello there');
//     }
// });

bot.login(token);

module.exports = bot;
