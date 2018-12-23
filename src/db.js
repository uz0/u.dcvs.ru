const lodashGet = require('lodash/get');
const extend = require('lodash/extend');
const isEmpty = require('lodash/isEmpty');
const mongo = require('mongojs');

const { mongoURI } = require('./config');

const USERS = 'users';
const MODERATION = 'moderation';

const db = mongo(mongoURI, [USERS, MODERATION]);

db.on('error', (err) => {
    console.log('database error', err);
});

db.on('connect', () => {
    console.log('database connected');
});

// Basic operations
async function update(collection, selector, query) {
    console.log('update', collection, selector, query)
    return new Promise((resolve, reject) => {
        db[collection].update(selector, query, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    });
}

async function get(collection, selector) {
    return new Promise((resolve, reject) => {
        db[collection].findOne(selector, (err, result) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    });
}

// async function set(collection, selector, query) {
//     return update(collection, selector, {
//         $set: query,
//     });
// }

// async function inc(collection, selector, query) {
//     return update(collection, selector, {
//         $inc: query,
//     });
// }

async function insert(collection, query) {
    return db[collection].insert(query);
}

// high lvl methods
async function getUser(userId) {
    let user = await get('users', { discordId: userId });

    if (!user) {
        user = { discordId: userId };

        insert('users', user);
    }

    return user;
}

async function getModuleData(moduleName, { user } = {}) {
    if (!user) {
        const res = await get('global', { moduleName });
        return res || {};
    }

    return lodashGet(user, `data.${moduleName}`, {});
}

async function updateModuleData(moduleName, query, { user } = {}) {
    // TODO PLEASE STOP PLEASE REWORK IT PLEASE!
    const queryForm = Object.keys(query)[0];
    let actualQuery = query[queryForm];
    const currentData = await getModuleData(moduleName, { user });

    if (queryForm === '$set') {
        actualQuery = extend(currentData, actualQuery);
    }

    if (!user) {
        if (isEmpty(currentData)) { // $setOrInsert???
            return insert('global', {
                moduleName,
                ...actualQuery,
            });
        }

        return update('global', { moduleName }, { [queryForm]: actualQuery });
    }

    return update('users', {
        discordId: user.discordId,
    }, {
        [queryForm]: {
            [`data.${moduleName}`]: actualQuery,
        },
    });
}

module.exports = {
    getUser,
    getModuleData,
    updateModuleData,

    // Unsafe be carefuly!
    get,
    update,
    insert,
};
