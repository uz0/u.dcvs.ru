module.exports = {
    PREFIX: '/',
    mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hyperloot',
    url: process.env.APP_URL || 'https://bot-hyperloot.herokuapp.com:443',
    admin: process.env.ADMINISTRATOR_NICKNAME || 'fenruga',
    chatId: process.env.CHAT_ID || '-248926187',
    telegram: {
        authToken: process.env.TELEGRAM_AUTH_TOKEN,
        webhookEndpoint: process.env.TELEGRAM_WEBHOOKENDPOINT || '',
    },
    discord: {
        authToken: process.env.DISCORD_AUTH_TOKEN,
        webhookEndpoint: process.env.DISCORD_WEBHOOKENDPOINT,
    },
};
