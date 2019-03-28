const debug = require('debug')('bot:i18n');
const CsvReader = require('promised-csv');
const sample = require('lodash/sample');
const fs = require('fs');

const { lang } = require('./config');

const reader = new CsvReader();

reader.on('row', ([key, value]) => {
    if (rawData[key]) {
        rawData[key].push(value);
    } else {
        rawData[key] = [value];
    }
});

const newlines = str => str;

function i18nFactory() {
    fs.readdirSync(`./i18n/${lang}/`).forEach((file) => {
        if (file.split('.')[1] === 'csv') {
            reader
                .read(`./i18n/${lang}/${file}`, rawData)
                .then(() => debug(`locale '${lang}' file '${file}' loaded`));
        }
    });

    return (key, props = {}) => {
        // strict must throw error!
        const emptyString = props._strict ? '' : key;
        const allKeys = rawData[key] || [emptyString];
        
        const parsedKeys = allKeys.map(key => {
            let string = key;
            
            Object
                .entries(props)
                .forEach(([k, v]) => {
                    string = string
                        .replace(`{{${k}}}`, v)
                        .replace(/\\n/g, '\n');
                });
            
            return string;
        });
 
        return props._allKeys ? parsedKeys : sample(parsedKeys);
    };
}

const i18n = () => {};

i18n.__INIT__ = function (context) {
    return {
        ...context,
        i18n: i18nFactory(),
    };
};

module.exports = i18n;
