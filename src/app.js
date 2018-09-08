// Inner kitchen our bot service

const {db} = require('./db');
const {PREFIX} = require('./config');
const {i18nFactory} = require('./i18n');

module.exports = function() {
    const i18n = i18nFactory();
    let modules = [];

    const self = {
        register(executors) {
            modules = [...executors];

            return self;
        },
        async process({ input = '', ...options }) {
            let response = {
                output: '',
            };

            for (const executor of modules) {
                if (executor.command && !input.startsWith(`${PREFIX}${executor.command}`)) {
                    continue;
                }

                try {
                    response = await executor(response, {
                        ...options,
                        i18n,
                        input,
                        db,
                    });
                } catch (error) {
                    response.error = error;
                }
            }

            options.handle(response);

            return self;
        }
    };

    return self;
};
