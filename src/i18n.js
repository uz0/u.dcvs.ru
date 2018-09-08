const CsvReader = require('promised-csv');
const reader = new CsvReader();

const rawData = {};

reader.on('row', ([key, value]) => {
    rawData[key] = value;
});

function i18nFactory() {
    reader.read('i18n.csv', rawData)

    return (key) => {
        return rawData[key];
    }
}

module.exports = {
    i18nFactory,
}
