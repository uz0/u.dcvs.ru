// Inner kitchen our bot service

const {db} = require('./db');

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

            for (const executor of modules)  {
                if (executor.command && executor.command !== input) {
                    continue;
                }

                response = await executor(response, {
                    ...options,
                    input,
                    db,
                });
            }

            options.handle(response);

            return self;
        }
    }

    return self;
}
