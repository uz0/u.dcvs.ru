const isEmpty = require('lodash/isEmpty');
const defaults = require('lodash/defaults');

async function addUserExp(ctx, userId, amount, reason) {
    const {
        getModuleData,
        updateModuleData,
        getUser,
    } = ctx;
    const user = await getUser(userId);
    const data = await getModuleData('exp', { user });

    if (isEmpty(data.log)) {
        await updateModuleData(
            'exp',
            { log: [] },
            { user },
        );
    }
    const newData = defaults(data, { amount: 0, log: [] });
    newData.amount += parseInt(amount, 10);
    newData.log.unshift({
        amount,
        reason,
    });

    await updateModuleData('exp', newData, { user });
}

module.exports = {
    addUserExp,
};
