const defaults = require('lodash/defaults');

module.exports = async function experienceAdd(req, ctx) {
    const {
        getModuleData,
        updateModuleData,
        getUser,
    } = ctx;
    const { experience } = req;

    if (!experience) {
        return req;
    }

    const {
        targetUserId,
        amount: rawAmount,
        reason,
        reasonId,
    } = experience;
    const amount = parseInt(rawAmount, 10);

    const user = await getUser(targetUserId);
    const data = await getModuleData('experience', { user });

    const newData = defaults(data, {
        amount: 0,
        log: [],
    });

    newData.amount += amount;

    newData.log.unshift({
        amount,
        reason,
        reasonId,
        date: new Date(),
    });


    updateModuleData('experience', newData, { user });

    // reset req properties for correct work with many exp adds in one chain
    req.experience = undefined;

    return req;
};
