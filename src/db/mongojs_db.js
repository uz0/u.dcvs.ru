const {mongoURI} = require('../config');
const mongo = require('mongojs');

const DB = 'hyperloot';
const USERS = 'users';

// TODO user mongo model
const colomns = [
    'id',
    'telegram_state',
    'discord_state',
    'eth_addr',
    'balance'
];

const db = mongo(`${mongoURI}`, [USERS]);
const users = db.collection(USERS);

// db.users.insert({id: 'qweqwe'});
// db.users.find({id: 'qweqwe'}, (err, res) => {
//     console.log(res);
// });

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log('database connected');
});

// TODO
// createUser

// TODO
// updateUser

// const defaultCallback = (err, result) => {
//     if(err) throw err;
//     callback(result);
// };

// function connect(callback) {
//     mongodb.MongoClient.connect(mongoURI, callback);
// }
//
// function getDb(err, client) {
//     if(err) throw err;
//
//     return client.db(DB);
// }
//
// function insertUser(db, user, callback = () => {}) {
//     const collection = db.collection(USERS);
//
//     collection.insert(user, defaultCallback);
// }
//
// function findUser(db, query, callback = () => {}) {
//     const collection = db.collection(USERS);
//
//     collection.find(query).toArray(defaultCallback);
// }

module.exports = {
    db,
    users: db.users,
};