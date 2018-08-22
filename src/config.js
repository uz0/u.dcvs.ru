module.exports = {
  mongoURI: process.env.MONGODB_URI,
  mongoURIdb: process.env.MONGODB_URI_DB,
  url: process.env.APP_URL || 'https://bot-hyperloot.herokuapp.com:443',
  telegram: {
    credentials: {
      authToken: process.env.TELEGRAM_AUTH_TOKEN || '639983676:AAHMdWPHL_s81ElXEvC6-OWq0jpHUoEtW-Q',
    },
    webhookEndpoint: process.env.TELEGRAM_WEBHOOKENDPOINT,
  },
};
