const CsvReader = require('promised-csv');
const reader = new CsvReader();

const rawData = {};

reader.on('row', ([key, value]) => {
    rawData[key] = value;
});

function i18nFactory() {
    reader.read('i18n.csv', rawData)

    return (key, props = {}) => {
        let string = rawData[key];

        for(let prop in props) {
            string = string.replace(`\${${prop}}`, props[prop]);
        }

        return string;
    }
}

module.exports = {
    i18nFactory,
}
