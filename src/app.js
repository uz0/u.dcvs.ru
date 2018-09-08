// Inner kitchen our bot service

const {db} = require('./db');
const {PREFIX} = require('./config');

module.exports = function() {
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
