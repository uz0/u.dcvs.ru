const isEmpty = require('lodash/isEmpty');
const defaults = require('lodash/defaults');

const command = require('../filters/command');

const lolAdd = async function (req, ctx) {
    const {
        i18n,
        getModuleData,
        updateModuleData,
        send,
        get,
    } = ctx;

    const { user } = req;

    const { args: { summonerName } } = req;
    const userBySummonerName = await get('users', {
        'data.lol.summonerName': summonerName,
    });

    if (!isEmpty(userBySummonerName) && userBySummonerName.id !== user.id) {
        send(i18n('lolAdd.alreadyExist'));

        return req;
    }

    if (!isEmpty(userBySummonerName) && userBySummonerName.id === user.id) {
        send(i18n('lolAdd.alreadyLinked'));

        return req;
    }

    const lolData = await getModuleData('lol', { user });
    const newData = defaults({ summonerName }, lolData);

    await updateModuleData('lol', newData, { user });
    if (!isEmpty(lolData.summonerName) && lolData.summonerName !== summonerName) {
        send(i18n('lolAdd.summonerNameChanged'));
    } else {
        send(i18n('lolAdd.summonerNameAdded'));
    }

    return req;
};

module.exports = [command('lolAdd summonerName'), lolAdd];
