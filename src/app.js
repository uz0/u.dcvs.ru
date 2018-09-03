// Inner kitchen our bot service

module.exports = function() {
    let modules = [];

    const self = {
        register(executors) {
            modules = [...executors];

            return self;
        },
        async process({ input = '', ...options }) {
            // const dbInstance = ...;
            let response = {
                output: '',
            };

            for (const executor of modules)  {
                if (executor.command && executor.command !== input) {
                    continue;
                }

                response = await executor(response, {
                    // db: dbInstance,
                    input,
                    ...options
                });
            }

            options.handle(response);

            return self;
        }
    }

    return self;
}
