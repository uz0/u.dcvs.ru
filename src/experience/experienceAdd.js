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
    } = experience;
    const amount = parseInt(rawAmount, 10);

    const user = await getUser(targetUserId);
    const data = await getModuleData('experience', { user });

    const newData = defaults(data, {
        amount: 0,
        log: [],
    });

    newData.amount += amount;

    let hasPrevRecord = false;

    newData.log = newData.log
        .filter(entry => entry)
        .map(entry => {

        if (entry && entry.reason === reason) {
            hasPrevRecord = true;

            return {
                ...entry,
                amount: entry.amount + amount,
            }
        }

        return entry;
    });

    if (!hasPrevRecord) {
        newData.log.unshift({
            amount,
            reason,
        });
    }

    updateModuleData('experience', newData, { user });

    // reset req properties for correct work with many exp adds in one chain
    req.experience = undefined;

    return req;
}
