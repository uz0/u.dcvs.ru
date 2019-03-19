const cloneDeep = require('lodash/cloneDeep');

const command = require('./command.filter');

function shuffle(original) {
    const a = cloneDeep(original);

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

const generateCommon = () => shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4);

function parseAnswer(req) {
    const { input } = req;
    const clearInput = input.replace(/\s/g, '');

    if (clearInput.length !== 4) {
        return null;
    }

    const asInts = clearInput.map(char => parseInt(char, 10));
    const fit = asInts.reduce(
        (acc, num) => acc && !Number.isNaN(num),
        true,
    );

    if (!fit) {
        return null;
    }

    req.cnbAnswer = asInts;

    return req;
}

function checkAnswer(target, answer) {
    const _target = target;
    const _answer = answer;
    let bulls = 0;
    let cows = 0;

    for (let i = _target.length - 1; i >= 0; i--) {
        console.log(i);
        if (_target[i] === _answer[i]) {
            bulls++;
            _target.splice(i, 1);
            _answer.splice(i, 1);
        }
    }

    for (let i = 0; i < _target.length; i++) {
        console.log(i);
        if (_answer.includes(_target[i])) {
            cows++;
            _answer.splice(_answer.indexOf(_target[i]), 1);
        }
    }

    return [bulls, cows];
}

// async function checkAnswer(req, ctx) {
//     const { cnbAnswer } = req;
//     const { i18n, getModuleData, updateModuleData } = ctx;
//     const { target } = await getModuleData('cnb', ctx);
//     let bulls = 0;
//     let cows = 0;
//
//     for (let i = 0; i < target.length; i++) {
//         if (target[i] === cnbAnswer[i]) {
//             bulls++;
//             target.splice(i, 1);
//             cnbAnswer.splice(i, 1);
//             i--;
//         }
//     }
//
//     for (let i = 0; i < target.length; i++) {
//         if (cnbAnswer.contains(target[i])) {
//             cows++;
//             cnbAnswer.splice(i, 1);
//         }
//     }
//     return [bulls, cows];
// }

const cnb = async function (req, ctx) {
    const { i18n, getModuleData, updateModuleData } = ctx;
    const { target } = await getModuleData('cnb', ctx);

    if (target) {
        throw (i18n('alreadyStartedError'));
    }

    await updateModuleData('cnb', { target: generateCommon() });

    req.output = i18n('start');

    return req;
};

const cnbProcessing = async function (req, ctx) {
    return req;
};

const cnbCheck = async function (req, ctx) {
    return req;
};

module.exports = checkAnswer;

// module.exports = [
//     parseAnswer,
//     [
//         command('cnb'), cnb,
//         command('cnb arg'), cnbProcessing,
//         cnbCheck,
//     ],
// ];
