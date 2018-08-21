const PREFIX = '!';

module.exports = {
    mongoURI: process.env.MONGODB_URI,
    mongoURIdb: process.env.MONGODB_URI_DB,
    url: process.env.APP_URL || 'https://bot-hyperloot.herokuapp.com:443',
    discord: {
        credentials: {
            authToken: process.env.DISCORD_AUTH_TOKEN || 'NDc5Njg4MTcwODM3OTAxMzcx.Dlyd6Q.dCvaAquznBiAQAaZSQXQFyAx9k8',
        },
        webhookEndpoint: process.env.DISCORD_WEBHOOKENDPOINT,
        prefix: PREFIX,
    },
    telegram: {
        credentials: {
          authToken: process.env.TELEGRAM_AUTH_TOKEN || '639983676:AAHMdWPHL_s81ElXEvC6-OWq0jpHUoEtW-Q',
        },
        webhookEndpoint: process.env.TELEGRAM_WEBHOOKENDPOINT,
        prefix: PREFIX,
    },
};
