const isEmpty = require('lodash/isEmpty');
const command = require('./command.filter');

const { discord: { warsRoleId, warsChannelId, warsBaseRoleId } } = require('../config');

const prepareWar = async function (request, { i18n, send, getModuleData, updateModuleData }) {
    const { list = [], status } = await getModuleData('wars');

    updateModuleData('wars', { 
        status: 'preparing',
        list: [],
     });

    send('prepare war!');
};

const joinWar = async function (request, { i18n, send, getModuleData, updateModuleData }) {
    const { user: { username } } = request;
    const { list = [], status } = await getModuleData('wars');

    if (status !== 'preparing') {
        send('war is not preparing!');

        return;
    }

    const newList = list.filter(usrn => usrn !== username);

    updateModuleData('wars', {
        list: [...newList, username],
     });

    send(`${username} was joined to war!`);
    send({ userActions: [{
        userName: username,
        addRole: warsRoleId
    }, {
        userName: username,
        addRole: warsBaseRoleId
    }]});
};

const startWar = async function (request, { i18n, send, getModuleData, updateModuleData }) {
    // const { list = [], status } = await getModuleData('wars');

    updateModuleData('wars', { 
        status: 'started',
     });

    send('war started!');
};

const kill = async function (request, { i18n, send, getModuleData, updateModuleData }) {
    const { args: { username } } = request;
    const { list = [], status } = await getModuleData('wars');

    if (status !== 'started') {
        send('war is not started!');

        return;
    }

    const newList = list.filter(usrn => usrn !== username);

    if (list.length !== newList.length) {
        updateModuleData('wars', {
            list: newList,
        });

        send({ userActions: [{
            userName: username,
            removeRole: warsRoleId
        }]});

        send(`killed ${username}`);
    }

    if (newList.length === 1) {
        const [ winnerName ] = newList;

        updateModuleData('wars', { 
            status: 'over',
        });

        send({ userActions: [{
            userName: winnerName,
            removeRole: warsRoleId
        }]});

        send(`war was over... and ${winnerName} win!`);

    }
};

module.exports = [
    [command('prepareWar'), prepareWar],
    [command('startWar'), startWar],
    [command('joinWar'), joinWar],
    [command('kill username'), kill],
];
