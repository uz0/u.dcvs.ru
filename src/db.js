const mongo = require('mongojs');

const {mongoURI} = require('./config');

const DB = 'hyperloot';
const USERS = 'users';

// TODO user mongo model
// const colomns = [
//     'id',
//     'telegram_state',
//     'discord_state',
//     'eth_addr',
//     'balance'
// ];

const db = mongo(mongoURI, [USERS]);
// const users = db.collection(USERS);

db.on('error', err => {
    console.log('database error', err);
});

db.on('connect', () => {
    console.log('database connected');
});


module.exports = {
    db,
};
