const defaults = require('lodash/defaults');

async function addUserExp(req, ctx) {
    const {
        getModuleData,
        updateModuleData,
        getUser,
    } = ctx;
    const { exp } = req;

    if (!exp) {
        return req;
    }

    const {
        targetUserId,
        amount,
        reason,
    } = exp;
    const user = await getUser(targetUserId);
    const data = await getModuleData('exp', { user });
    const newData = defaults(data, { amount: 0, log: [] });

    newData.amount += parseInt(amount, 10);
    newData.log.unshift({
        amount,
        reason,
    });

    await updateModuleData('exp', newData, { user });

    // reset req properties for correct work with many exp adds in one chain
    req.exp = undefined;

    return req;
}

module.exports = addUserExp;
