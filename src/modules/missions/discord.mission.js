const _ = require('lodash');
const {makeMission} = require("./helpers");

const missionData = {
    command: 'discord',
    name: 'join discord',
    brief: 'tell us your discord tag',
    reward: 1,
};

module.exports = makeMission(missionData);
// module.exports = async function(response, { input, db, id }) {
//     if (response.user.completed.includes(missionData.command)) {
//         response.output = 'You had already finished this mission';
//
//         return Promise.resolve(response)
//     }
//
//     db.users.update({
//         telegramId: id,
//     }, {
//         $set: {
//             pending: missionData.command,
//         },
//     });
//
//     response.output = missionData.brief;
//     response.pending = missionData.command;
//
//     return Promise.resolve(response)
// };

module.exports.command = missionData.command;
module.exports.missionData = missionData;
